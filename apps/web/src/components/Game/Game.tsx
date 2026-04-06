import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement, MouseEvent, ChangeEvent } from 'react';

import Board from './Board';
import styles from './game.scss';
import HighScores from './HighScores';
import InfoPanels from './InfoPanels';
import NewGamePanel from './NewGamePanel';
import Tile from './Tile';

import { useSelector, useDispatch } from 'store';
import {
    newGame,
    updateOnChange,
    makeMoveCheckWin,
    restartBoard,
} from 'store/game/gameActions';
import { getGame } from 'store/game/gameSelectors';

export const Game = (): ReactElement => {
    const dispatch = useDispatch();
    const game = useSelector(getGame);

    const isLoading = game.requestsCount > 0;

    const onMoveClick = (event: MouseEvent<HTMLElement>): void => {
        const coords = event.currentTarget.getAttribute(
            'data-coords',
        ) as string;
        dispatch(makeMoveCheckWin(coords));
    };

    const onNewGameClick = (event: MouseEvent<HTMLElement>): void => {
        event.preventDefault();
        void dispatch(
            newGame(game.newSize, game.easyMode, game.seed, game.gameId),
        );
    };
    const updateGameState = (
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
    ): void => {
        const { name } = event.currentTarget;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const value =
            event.currentTarget.type === 'checkbox'
                ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  event.currentTarget?.checked
                : event.currentTarget?.value;
        dispatch(updateOnChange(name, value as string));
    };

    const onRestartClick = (event: MouseEvent<HTMLElement>): void => {
        event.preventDefault();
        dispatch(restartBoard());
    };

    return (
        <section>
            <div className="row">
                <div className="col-sm-7 col-md-8 col-lg-9">
                    <Board game={game} onMoveClick={onMoveClick} />
                </div>
                <div className="col-sm-5 col-md-4 col-lg-3">
                    <div className={styles.exampleBox}>
                        {game.firstTime && (
                            <>
                                <p>
                                    Game objective:{' '}
                                    <span className={styles.boldTip}>
                                        flip every tile to the gray side.
                                    </span>{' '}
                                    Score is based on board size, time spent and
                                    amount of moves. Every single board is
                                    guaranteed to be solvable.
                                </p>
                                <div className={styles.example}>
                                    <Tile
                                        coords={[3, 0]}
                                        isDisabled
                                        size={8}
                                        type={1}
                                    />
                                    &nbsp;
                                    <FontAwesomeIcon icon={faArrowRight} />
                                    &nbsp;
                                    <Tile
                                        coords={[3, 0]}
                                        isDisabled
                                        size={8}
                                        type={0}
                                    />
                                </div>
                                <p className={styles.boldTip}>
                                    Start a new game to begin.
                                </p>
                            </>
                        )}
                    </div>
                    <NewGamePanel
                        game={game}
                        loading={isLoading}
                        onNewGameClick={onNewGameClick}
                        onRestartClick={onRestartClick}
                        updateGameState={updateGameState}
                    />
                </div>
            </div>
            <div className="row justify-content-between">
                <div className="col-sm-5 col-md-4 col-lg-3 order-sm-last">
                    <InfoPanels game={game} />
                </div>
                <div className="col-sm-7 col-md-8 col-lg-9">
                    <HighScores />
                </div>
            </div>
        </section>
    );
};

export default Game;
