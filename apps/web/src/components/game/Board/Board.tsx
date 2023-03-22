/* eslint-disable react/no-array-index-key */
import React, { ReactElement } from 'react';

import Tile from '../Tile';

import styles from './board.scss';

import { GameState } from 'store/game/gameTypes';

type Props = {
    game: GameState;
    onMoveClick: () => void;
};

const Board = ({ game, onMoveClick }: Props): ReactElement => {
    return (
        <section>
            {game.board.map((row, i) => {
                return (
                    <div
                        key={`${JSON.stringify(row)}_${i}`}
                        className={styles.boardRow}
                    >
                        {/* type 3 are left coord tiles */}
                        <Tile key={i} coords={[i]} size={game.size} type={3} />
                        {row.map((column, j) => {
                            return (
                                <Tile
                                    key={`${JSON.stringify(column)}_${j}`}
                                    coords={[i, j]}
                                    isDisabled={game.isDisabled}
                                    onMoveClick={onMoveClick}
                                    size={game.size}
                                    type={column}
                                />
                            );
                        })}
                    </div>
                );
            })}
            <div className={styles.boardRow}>
                <Tile
                    coords={[-1, -1]}
                    isDisabled={false}
                    size={game.size}
                    type={4}
                />
                {game.board[0].map((_column, k) => {
                    // type 4 are bottom coord tiles
                    return (
                        <Tile key={k} coords={[k]} size={game.size} type={4} />
                    );
                })}
            </div>
        </section>
    );
};

export default Board;
