import { ReactElement, MouseEvent } from 'react';

import Tile from '../Tile';

import styles from './board.module.scss';

import { GameState } from 'store/game/gameTypes';

type Props = {
    game: GameState;
    onMoveClick: (event: MouseEvent<HTMLElement>) => void;
};

const noop = (_event: MouseEvent<HTMLElement>): void => undefined;

const Board = ({ game, onMoveClick }: Props): ReactElement => {
    return (
        <section>
            {game.board.map((row, i) => (
                <div className={styles.boardRow} key={i}>
                    {/* type 3 are left coord tiles */}
                    <Tile
                        coords={[i]}
                        isDisabled={false}
                        key={`${i}_coord`}
                        onMoveClick={noop}
                        size={game.size}
                        type={3}
                    />
                    {row.map((type, j) => (
                        <Tile
                            coords={[i, j]}
                            isDisabled={game.isDisabled}
                            key={`${i}_${j}`}
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
                    onMoveClick={noop}
                    size={game.size}
                    type={4}
                />
                {game.board[0].map((_type, k) => (
                    // type 4 are bottom coord tiles
                    <Tile
                        coords={[k]}
                        isDisabled={false}
                        key={`${k}_coord`}
                        onMoveClick={noop}
                        size={game.size}
                        type={4}
                    />
                ))}
            </div>
        </section>
    );
};

export default Board;
