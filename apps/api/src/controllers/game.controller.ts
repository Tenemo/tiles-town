import { Request, Response } from 'express';
import type {
    HighScore,
    NewGameRequestBody,
    NewGameResponse,
    WinGameParams,
    WinGameRequestBody,
    WinGameResponse,
} from '@tiles-town/contracts';
import {
    completeGame,
    createNewGame,
    fetchHighScores,
} from '../services/game.service';

const newGame = async (
    req: Request<unknown, unknown, NewGameRequestBody>,
    res: Response<NewGameResponse>,
): Promise<void> => {
    const game = await createNewGame(req.body);
    res.json(game);
};

const winGame = async (
    req: Request<WinGameParams, unknown, WinGameRequestBody>,
    res: Response<WinGameResponse>,
): Promise<void> => {
    const result = await completeGame(req.params.id, req.body);

    if (result.statusCode) {
        res.status(result.statusCode);
    }

    res.json(result.body);
};

const highScores = async (
    _req: Request,
    res: Response<HighScore[]>,
): Promise<void> => {
    const scores = await fetchHighScores();
    res.json(scores);
};

export default {
    newGame,
    winGame,
    highScores,
};
