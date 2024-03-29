// TODO: Rewrite the inputs to be inside labels
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { ReactElement, MouseEvent, ChangeEvent } from 'react';

import styles from './newGamePanel.scss';

import { gameClientConfig } from 'constants/appConstants';
import { GameState } from 'store/game/gameTypes';

type Props = {
    game: GameState;
    onNewGameClick: (event: MouseEvent<HTMLElement>) => void;
    onRestartClick: (event: MouseEvent<HTMLElement>) => void;
    updateGameState: (
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
    ) => void;
    loading: boolean;
};

const NewGamePanel = ({
    game,
    onNewGameClick,
    updateGameState,
    onRestartClick,
    loading,
}: Props): ReactElement => {
    const selectOptions = [];
    for (
        let i = gameClientConfig.minSize;
        i < gameClientConfig.maxSize + 1;
        i += 1
    ) {
        selectOptions.push(
            <option key={i} value={i}>
                {i}
                {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                @ts-ignore */}
                {i === 6 && ' - suggested'}
            </option>,
        );
    }
    return (
        <div className={styles.newGamePanel}>
            <form className="simpleBox">
                <div className="form-group">
                    <input
                        className="btn btn-primary"
                        disabled={loading}
                        onClick={onNewGameClick}
                        type="submit"
                        value={loading ? 'Loading...' : 'New Game'}
                    />
                    <input
                        className="btn btn-primary"
                        disabled={game.isDisabled}
                        onClick={onRestartClick}
                        type="submit"
                        value="Restart"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="playerName">
                        Player name to show on the scoreboard:
                    </label>
                    <input
                        className="form-control"
                        id="playerName"
                        maxLength={32}
                        name="playerName"
                        onChange={updateGameState}
                        placeholder="anonymous"
                        type="text"
                        value={game.playerName}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newSize">Board size: </label>
                    <select
                        className="form-control"
                        id="newSize"
                        name="newSize"
                        onChange={updateGameState}
                        value={game.newSize}
                    >
                        {selectOptions}
                    </select>
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <input
                            checked={game.easyMode}
                            className="form-check-input"
                            id="easyMode"
                            name="easyMode"
                            onChange={updateGameState}
                            type="checkbox"
                        />
                        <label className="form-check-label" htmlFor="easyMode">
                            Easy Mode - disables score
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="seed">
                        Optional seed for board generation, disables score:
                    </label>
                    <input
                        className="form-control"
                        maxLength={256}
                        name="seed"
                        onChange={updateGameState}
                        placeholder="myBoardToShareWithFriends"
                        type="text"
                        value={game.seed}
                    />
                </div>
            </form>
        </div>
    );
};
export default NewGamePanel;
