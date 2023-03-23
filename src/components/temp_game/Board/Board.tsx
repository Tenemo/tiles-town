/* eslint-disable react/no-array-index-key */
import React, { ReactElement, MouseEvent } from 'react';

import Tile from '../Tile';

import styles from './board.scss';

import { GameState } from 'store/game/gameTypes';

type Props = {
    game: GameState;
    onMoveClick: (event: MouseEvent<HTMLElement>) => void;
};

const Board = ({ game, onMoveClick }: Props): ReactElement => {
    return (
        <section>
            {game.board.map((row, i) => (
                <div key={i} className={styles.boardRow}>
                    {/* type 3 are left coord tiles */}
                    <Tile
                        key={`${i}_coord`}
                        coords={[i]}
                        isDisabled={false}
                        size={game.size}
                        type={3}
                    />
                    {row.map((type, j) => (
                        <Tile
                            key={`${i}_${j}`}
                            coords={[i, j]}
                            isDisabled={game.isDisabled}
                            onMoveClick={onMoveClick}
                            size={game.size}
                            type={type}
                        />
                    ))}
                </div>
            ))}
            <div className={styles.boardRow}>
                <Tile
                    coords={[-1, -1]}
                    isDisabled={false}
                    size={game.size}
                    type={4}
                />
                {game.board[0].map((_type, k) => (
                    // type 4 are bottom coord tiles
                    <Tile
                        key={`${k}_coord`}
                        coords={[k]}
                        isDisabled={false}
                        size={game.size}
                        type={4}
                    />
                ))}
            </div>
        </section>
    );
};

export default Board;
