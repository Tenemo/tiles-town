import React, { ReactElement, Fragment } from 'react';

import styles from './infoPanels.scss';

import { GameState } from 'store/game/gameTypes';

type Props = {
    game: GameState;
};

const Panel = ({ game }: Props): ReactElement => {
    return (
        <div className={styles.infoPanels}>
            <div className="simpleBox">
                {game.moveCount != null && game.moveCount != 0 && (
                    <p>Move count: {game.moveCount}</p>
                )}
            </div>
            <div className="simpleBox">
                {game.previous.gameId && <h5>Previous Won Game</h5>}
                {game.previous.score && <div>Score: {game.previous.score}</div>}
                {game.previous.size && <div>Size: {game.previous.size}</div>}
                {game.previous.moveCount && (
                    <div>Move count: {game.previous.moveCount}</div>
                )}
                {game.previous.time && (
                    <div>Time: {Math.trunc(game.previous.time / 1000)} s</div>
                )}
                {game.previous.seed && <div>Seed: {game.previous.seed}</div>}
                {game.previous.moves != null &&
                    game.previous.moves.length !== 0 && (
                        <p className={styles.moves}>
                            Moves made:{' '}
                            {game.previous.moves.map((move, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <Fragment key={`${i}_${move}`}>
                                    {!!i && ', '}
                                    {move}
                                </Fragment>
                            ))}
                        </p>
                    )}
            </div>
        </div>
    );
};

export default Panel;
