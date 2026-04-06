import { Express } from 'express';
import request from 'supertest';
import {
    GAME_ROUTES,
    type HighScore,
    type MessageResponse,
    type NewGameRequestBody,
    type NewGameResponse,
    type WinGameRequestBody,
    type WinGameResponse,
} from '@tiles-town/contracts';

export const parseBody = <T>(response: request.Response): T =>
    response.body as T;

export const fetchHealthCheck = (app: Express): request.Test =>
    request(app).get(GAME_ROUTES.healthCheck);

export const createGame = (
    app: Express,
    payload: NewGameRequestBody,
): request.Test => request(app).post(GAME_ROUTES.newGame).send(payload);

export const winGame = (
    app: Express,
    gameId: string,
    payload: WinGameRequestBody,
): request.Test => request(app).put(GAME_ROUTES.winGame(gameId)).send(payload);

export const fetchHighScores = (app: Express): request.Test =>
    request(app).get(GAME_ROUTES.highScores);

export type {
    HighScore,
    MessageResponse,
    NewGameRequestBody,
    NewGameResponse,
    WinGameRequestBody,
    WinGameResponse,
};
