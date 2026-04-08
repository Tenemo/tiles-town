import { ReactElement, Fragment } from 'react';

import styles from './infoPanels.module.scss';

import { GameState } from 'store/game/gameTypes';

type Props = {
    game: GameState;
};

const Panel = ({ game }: Props): ReactElement => {
    return (
        <div className={styles.infoPanels}>
            <div className="simpleBox">
                {game.moveCount !== 0 && <p>Move count: {game.moveCount}</p>}
            </div>
            <div className="simpleBox">
                {game.previous.gameId && <h5>Previous won game</h5>}
                {game.previous.score != null && (
                    <div>Score: {game.previous.score}</div>
                )}
                {game.previous.size != null && (
                    <div>Size: {game.previous.size}</div>
                )}
                {game.previous.moveCount != null && (
                    <div>Move count: {game.previous.moveCount}</div>
                )}
                {game.previous.time != null && (
                    <div>Time: {Math.trunc(game.previous.time / 1000)} s</div>
                )}
                {game.previous.seed && <div>Seed: {game.previous.seed}</div>}
                {game.previous.moves != null &&
                    game.previous.moves.length !== 0 && (
                        <p className={styles.moves}>
                            Moves made:{' '}
                            {game.previous.moves.map((move, i) => (
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
