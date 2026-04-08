import { Express } from 'express';
import { solveBoard } from '@tiles-town/testkit';
import {
    createGame,
    fetchHealthCheck,
    fetchHighScores,
    parseBody,
    type HighScore,
    type MessageResponse,
    type NewGameResponse,
    type WinGameResponse,
    winGame,
} from '../support/api';

type GameModel = {
    count: () => Promise<number>;
    destroy: (options: {
        where: object;
        truncate?: boolean;
        force?: boolean;
    }) => Promise<number>;
};

let app: Express;
let gameModel: GameModel;
let connectDatabase: () => Promise<void>;
let closeDatabase: () => Promise<void>;
let migrateDatabase: () => Promise<void>;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '4200';
    process.env.DATABASE_URL =
        process.env.DATABASE_URL ||
        'postgres://postgres:postgres@127.0.0.1:5434/tiles-town';
    process.env.DATABASE_SSL = 'false';

    const database = await import('../../src/database');
    const migrator = await import('../../src/migrator');
    const server = await import('../../src/server');

    app = server.app;
    connectDatabase = database.connectDatabase;
    closeDatabase = database.closeDatabase;
    migrateDatabase = migrator.migrateDatabase;
    gameModel = database.default.game as unknown as GameModel;

    await connectDatabase();
    await migrateDatabase();
});

beforeEach(async () => {
    await gameModel.destroy({
        where: {},
        truncate: true,
        force: true,
    });
});

afterAll(async () => {
    await closeDatabase();
});

describe('game routes', () => {
    it('returns a health check response', async () => {
        const response = await fetchHealthCheck(app);

        expect(response.status).toBe(200);
        expect(response.text).toBe('OK');
    });

    it('rejects invalid new game payloads with a clear message', async () => {
        const response = await createGame(app, {
            size: 99,
        });
        const body = parseBody<MessageResponse>(response);

        expect(response.status).toBe(400);
        expect(body.message).toContain('size');
    });

    it('replaces an unfinished previous game when a new one is requested', async () => {
        const firstResponse = await createGame(app, {
            size: 4,
        });
        const firstGame = parseBody<NewGameResponse>(firstResponse);

        expect(firstResponse.status).toBe(200);
        expect(await gameModel.count()).toBe(1);

        const secondResponse = await createGame(app, {
            size: 4,
            previousId: firstGame.gameId,
        });
        const secondGame = parseBody<NewGameResponse>(secondResponse);

        expect(secondResponse.status).toBe(200);
        expect(await gameModel.count()).toBe(1);
        expect(secondGame.gameId).not.toBe(firstGame.gameId);
    });

    it('returns a 404 response when a game does not exist', async () => {
        const response = await winGame(
            app,
            '1234567890abcdef1234567890abcdef',
            {
                moves: ['A1'],
                playerName: 'missing-game',
            },
        );

        expect(response.status).toBe(404);
        expect(parseBody<WinGameResponse>(response)).toMatchObject({
            info: "Game doesn't exist",
        });
    });

    it('rejects illegal move sequences', async () => {
        const newGameResponse = await createGame(app, {
            size: 4,
        });
        const newGame = parseBody<NewGameResponse>(newGameResponse);

        expect(newGameResponse.status).toBe(200);

        const response = await winGame(app, newGame.gameId, {
            moves: [],
            playerName: 'illegal-moves',
        });
        const winGameResponse = parseBody<WinGameResponse>(response);

        expect(response.status).toBe(400);
        expect(winGameResponse.info).toBe('Illegal move sequence');
    });

    it('rejects malformed move coordinates before they reach game logic', async () => {
        const newGameResponse = await createGame(app, {
            size: 4,
        });
        const newGame = parseBody<NewGameResponse>(newGameResponse);

        expect(newGameResponse.status).toBe(200);

        const response = await winGame(app, newGame.gameId, {
            moves: ['AAAA'],
            playerName: 'bad-coordinates',
        });
        const body = parseBody<MessageResponse>(response);

        expect(response.status).toBe(400);
        expect(body.message).toContain('moves');
    });

    it('rejects syntactically valid moves that fall outside the current board', async () => {
        const newGameResponse = await createGame(app, {
            size: 4,
        });
        const newGame = parseBody<NewGameResponse>(newGameResponse);

        expect(newGameResponse.status).toBe(200);

        const response = await winGame(app, newGame.gameId, {
            moves: ['P16'],
            playerName: 'outside-board',
        });

        expect(response.status).toBe(400);
        expect(parseBody<WinGameResponse>(response)).toMatchObject({
            info: 'Illegal move sequence',
        });
    });

    it('stores a trimmed player name and reports repeat wins without mutating it', async () => {
        const newGameResponse = await createGame(app, {
            size: 4,
        });
        const newGame = parseBody<NewGameResponse>(newGameResponse);
        const winningMoves = solveBoard(newGame.board);

        const firstWinResponse = await winGame(app, newGame.gameId, {
            moves: winningMoves,
            playerName: '  Trim Me  ',
        });
        const secondWinResponse = await winGame(app, newGame.gameId, {
            moves: winningMoves,
            playerName: 'Another Name',
        });
        const highScoresResponse = await fetchHighScores(app);
        const highScores = parseBody<HighScore[]>(highScoresResponse);

        expect(firstWinResponse.status).toBe(200);
        expect(secondWinResponse.status).toBe(200);
        expect(parseBody<WinGameResponse>(secondWinResponse)).toMatchObject({
            info: "You've won already",
            isWon: true,
        });
        expect(highScores).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    game_player_name: 'Trim Me',
                }),
            ]),
        );
    });

    it('persists valid wins and filters high scores correctly', async () => {
        const winningStandardGame = await createGame(app, {
            size: 4,
        });
        const winningLargeGame = await createGame(app, {
            size: 5,
        });
        const customSeedGame = await createGame(app, {
            size: 4,
            seed: 'custom-seed',
        });
        const easyModeGame = await createGame(app, {
            size: 4,
            easyMode: true,
        });
        const standardGame = parseBody<NewGameResponse>(winningStandardGame);
        const largeGame = parseBody<NewGameResponse>(winningLargeGame);
        const customGame = parseBody<NewGameResponse>(customSeedGame);
        const easyGame = parseBody<NewGameResponse>(easyModeGame);

        const standardMoves = solveBoard(standardGame.board);
        const largeMoves = solveBoard(largeGame.board);
        const customMoves = solveBoard(customGame.board);
        const easyMoves = solveBoard(easyGame.board);

        const standardWin = await winGame(app, standardGame.gameId, {
            moves: standardMoves,
            playerName: 'Standard Winner',
        });
        const largeWin = await winGame(app, largeGame.gameId, {
            moves: largeMoves,
            playerName: 'Large Winner',
        });
        const customWin = await winGame(app, customGame.gameId, {
            moves: customMoves,
            playerName: 'Custom Winner',
        });
        const easyWin = await winGame(app, easyGame.gameId, {
            moves: easyMoves,
            playerName: 'Easy Winner',
        });

        expect(standardWin.status).toBe(200);
        expect(largeWin.status).toBe(200);
        expect(customWin.status).toBe(200);
        expect(easyWin.status).toBe(200);

        const standardBody = parseBody<WinGameResponse>(standardWin);
        const largeBody = parseBody<WinGameResponse>(largeWin);
        const customBody = parseBody<WinGameResponse>(customWin);
        const easyBody = parseBody<WinGameResponse>(easyWin);

        expect(standardBody.score).toBeTypeOf('number');
        expect(largeBody.score).toBeTypeOf('number');
        expect(customBody.score).toBeUndefined();
        expect(easyBody.score).toBeUndefined();

        const highScoresResponse = await fetchHighScores(app);
        const highScores = parseBody<HighScore[]>(highScoresResponse);

        expect(highScoresResponse.status).toBe(200);
        expect(highScores).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    game_player_name: 'Standard Winner',
                }),
                expect.objectContaining({
                    game_player_name: 'Large Winner',
                }),
            ]),
        );
        expect(highScores).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    game_player_name: 'Custom Winner',
                }),
                expect.objectContaining({
                    game_player_name: 'Easy Winner',
                }),
            ]),
        );

        const filteredScores = highScores.filter(
            (entry) =>
                entry.game_player_name === 'Standard Winner' ||
                entry.game_player_name === 'Large Winner',
        );

        expect(filteredScores).toHaveLength(2);
        expect(filteredScores[0].game_score).toBeGreaterThanOrEqual(
            filteredScores[1].game_score,
        );
    });
});
