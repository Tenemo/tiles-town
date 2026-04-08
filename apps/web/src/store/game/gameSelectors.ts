import type { HighScore } from '@tiles-town/contracts';
import { RootState } from 'store';
import { GameState } from './gameTypes';

export const getGame = (state: RootState): GameState => state.game;
export const getHighScores = (state: RootState): HighScore[] =>
    state.game.highScores;
