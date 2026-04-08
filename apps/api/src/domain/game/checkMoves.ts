import {
    applyMove,
    countActiveTiles,
    flipTile,
    parseMoveCoordinates,
} from '@tiles-town/game-core';
import { GameAttributes } from '../../models/game.model';
import { generateBoard } from './generateBoard';

export const flip = flipTile;

export const checkMoves = (game: GameAttributes): boolean => {
    const board = generateBoard(
        game.game_size,
        game.game_seed,
        game.game_easyMode,
    ).tiles;

    if (!game.game_moves) {
        return false;
    }

    for (const move of game.game_moves.split(',')) {
        applyMove(board, parseMoveCoordinates(move, game.game_size));
    }

    return countActiveTiles(board) === 0;
};
