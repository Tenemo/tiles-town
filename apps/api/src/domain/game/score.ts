import { GAME_CONFIG } from '../../config';
import { GameAttributes } from '../../models/game.model';

export const calculateScore = ({
    game_size,
    game_isSeedCustom,
    game_easyMode,
    game_move_count,
    game_start_time,
    game_end_time,
}: GameAttributes): number | null => {
    if (!game_move_count || !game_start_time || !game_end_time) {
        throw new Error('Missing game data. Cannot calculate score.');
    }

    if (
        game_size < GAME_CONFIG.minSize ||
        game_isSeedCustom === true ||
        game_easyMode === true
    ) {
        return null;
    }

    const sizeScore = Math.pow(2.5, game_size);
    const moveScore = game_size / Math.sqrt(game_move_count);
    const elapsedSeconds =
        (game_end_time.getTime() - game_start_time.getTime()) / 1000;
    const timeScore = game_size / Math.sqrt(elapsedSeconds);

    return Math.trunc(sizeScore * moveScore * Math.sqrt(timeScore));
};
