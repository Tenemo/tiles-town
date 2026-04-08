import { ReactElement, MouseEvent } from 'react';
import { intToLetter } from '@tiles-town/game-core';

import BoardAxisLabel from './BoardAxisLabel';
import Tile from '../Tile';

import styles from './board.module.scss';

import { GameState } from 'store/game/gameTypes';

type Props = {
    game: GameState;
    onMoveClick: (event: MouseEvent<HTMLElement>) => void;
};

const Board = ({ game, onMoveClick }: Props): ReactElement => {
    const columnLabels = Array.from({ length: game.size }, (_, columnIndex) =>
        intToLetter(columnIndex),
    );

    return (
        <section>
            {game.board.map((row, rowIndex) => (
                <div className={styles.boardRow} key={rowIndex}>
                    <BoardAxisLabel value={(game.size - rowIndex).toString()} />
                    {row.map((type, j) => (
                        <Tile
                            columnIndex={j}
                            isDisabled={game.isDisabled}
                            key={`${rowIndex}_${j}`}
                            onMoveClick={onMoveClick}
                            rowIndex={rowIndex}
                            size={game.size}
                            tile={type}
                        />
                    ))}
                </div>
            ))}
            <div className={styles.boardRow}>
                <BoardAxisLabel value="" />
                {columnLabels.map((label, columnIndex) => (
                    <BoardAxisLabel
                        key={`${columnIndex}_coord`}
                        value={label}
                    />
                ))}
            </div>
        </section>
    );
};

export default Board;
