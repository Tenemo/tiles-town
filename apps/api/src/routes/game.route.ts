import { Router } from 'express';
import {
    NewGameRequestBodySchema,
    WinGameParamsSchema,
    WinGameRequestBodySchema,
} from '@tiles-town/contracts';
import gameController from '../controllers/game.controller';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router
    .route('/new')
    /* POST /api/game/new - Initialize new game */
    .post(
        validateRequest({
            body: NewGameRequestBodySchema,
        }),
        asyncHandler(gameController.newGame),
    );

router
    .route('/:id')
    /* PUT /api/game/:id - Win given game */
    .put(
        validateRequest({
            body: WinGameRequestBodySchema,
            params: WinGameParamsSchema,
        }),
        asyncHandler(gameController.winGame),
    );

router
    .route('/highScores')
    /* GET /api/game/highScores - Get highscores */
    .get(asyncHandler(gameController.highScores));

export default router;
