import { Express } from 'express';
import request from 'supertest';
import type {
    HighScore,
    NewGameResponse,
    WinGameResponse,
} from '@tiles-town/contracts';
import { solveBoard } from '../../../../tests/support/solveBoard';

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

const getBody = <T>(response: request.Response): T => response.body as T;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '4200';
    process.env.DATABASE_URL =
        process.env.DATABASE_URL ||
        'postgres://postgres:postgres@127.0.0.1:5434/tiles-town';
    process.env.DATABASE_SSL = 'false';
    process.env.CORS_ALLOWED_ORIGINS =
        'http://127.0.0.1:3200,http://localhost:3200';

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
        const response = await request(app).get('/api/health-check');

        expect(response.status).toBe(200);
        expect(response.text).toBe('OK');
    });

    it('rejects invalid new game payloads', async () => {
        const response = await request(app).post('/api/game/new').send({
            size: 99,
        });

        expect(response.status).toBe(400);
    });

    it('replaces an unfinished previous game when a new one is requested', async () => {
        const firstResponse = await request(app).post('/api/game/new').send({
            size: 4,
        });
        const firstGame = getBody<NewGameResponse>(firstResponse);

        expect(firstResponse.status).toBe(200);
        expect(await gameModel.count()).toBe(1);

        const secondResponse = await request(app).post('/api/game/new').send({
            size: 4,
            previousId: firstGame.gameId,
        });
        const secondGame = getBody<NewGameResponse>(secondResponse);

        expect(secondResponse.status).toBe(200);
        expect(await gameModel.count()).toBe(1);
        expect(secondGame.gameId).not.toBe(firstGame.gameId);
    });

    it('rejects illegal move sequences', async () => {
        const newGameResponse = await request(app).post('/api/game/new').send({
            size: 4,
        });
        const newGame = getBody<NewGameResponse>(newGameResponse);

        expect(newGameResponse.status).toBe(200);

        const response = await request(app)
            .put(`/api/game/${newGame.gameId}`)
            .send({
                moves: [],
                playerName: 'illegal-moves',
            });
        const winGameResponse = getBody<WinGameResponse>(response);

        expect(response.status).toBe(400);
        expect(winGameResponse.info).toBe('Illegal move sequence');
    });

    it('persists valid wins and filters high scores correctly', async () => {
        const winningStandardGame = await request(app)
            .post('/api/game/new')
            .send({
                size: 4,
            });
        const winningLargeGame = await request(app).post('/api/game/new').send({
            size: 5,
        });
        const customSeedGame = await request(app).post('/api/game/new').send({
            size: 4,
            seed: 'custom-seed',
        });
        const easyModeGame = await request(app).post('/api/game/new').send({
            size: 4,
            easyMode: true,
        });
        const standardGame = getBody<NewGameResponse>(winningStandardGame);
        const largeGame = getBody<NewGameResponse>(winningLargeGame);
        const customGame = getBody<NewGameResponse>(customSeedGame);
        const easyGame = getBody<NewGameResponse>(easyModeGame);

        const standardMoves = solveBoard(standardGame.board);
        const largeMoves = solveBoard(largeGame.board);
        const customMoves = solveBoard(customGame.board);
        const easyMoves = solveBoard(easyGame.board);

        const standardWin = await request(app)
            .put(`/api/game/${standardGame.gameId}`)
            .send({
                moves: standardMoves,
                playerName: 'Standard Winner',
            });
        const largeWin = await request(app)
            .put(`/api/game/${largeGame.gameId}`)
            .send({
                moves: largeMoves,
                playerName: 'Large Winner',
            });
        const customWin = await request(app)
            .put(`/api/game/${customGame.gameId}`)
            .send({
                moves: customMoves,
                playerName: 'Custom Winner',
            });
        const easyWin = await request(app)
            .put(`/api/game/${easyGame.gameId}`)
            .send({
                moves: easyMoves,
                playerName: 'Easy Winner',
            });

        expect(standardWin.status).toBe(200);
        expect(largeWin.status).toBe(200);
        expect(customWin.status).toBe(200);
        expect(easyWin.status).toBe(200);

        const standardBody = standardWin.body as WinGameResponse;
        const largeBody = largeWin.body as WinGameResponse;
        const customBody = getBody<WinGameResponse>(customWin);
        const easyBody = getBody<WinGameResponse>(easyWin);

        expect(standardBody.score).toBeTypeOf('number');
        expect(largeBody.score).toBeTypeOf('number');
        expect(customBody.score).toBeUndefined();
        expect(easyBody.score).toBeUndefined();

        const highScoresResponse = await request(app).get(
            '/api/game/highScores',
        );
        const highScores = getBody<HighScore[]>(highScoresResponse);

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
