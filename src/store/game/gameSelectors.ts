import { createSelector } from 'reselect';

import { GameState } from 'store/game/gameTypes';
import { RootState } from 'store/types';

export const getGame = (state: RootState): GameState => state.game;
export const getHighScores = createSelector(
    getGame,
    (game: GameState) => game.highScores,
);
