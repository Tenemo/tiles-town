import { ReactElement, MouseEvent, ChangeEvent, FormEvent } from 'react';

import styles from './newGamePanel.module.scss';

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
    const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
    };

    const selectOptions = [];
    for (
        let i = gameClientConfig.minSize;
        i < gameClientConfig.maxSize + 1;
        i += 1
    ) {
        selectOptions.push(
            <option key={i} value={i}>
                {i}
                {Number(i) === 6 && ' - suggested'}
            </option>,
        );
    }
    return (
        <div className={styles.newGamePanel}>
            <form className="simpleBox" onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        className="btn btn-primary"
                        disabled={loading}
                        onClick={onNewGameClick}
                        type="button"
                        value={loading ? 'Loading...' : 'New Game'}
                    />
                    <input
                        className="btn btn-primary"
                        disabled={game.isDisabled}
                        onClick={onRestartClick}
                        type="button"
                        value="Restart"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="playerName">
                        Player name to show on the scoreboard:
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
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="newSize">
                        Board size:
                        <select
                            className="form-control"
                            id="newSize"
                            name="newSize"
                            onChange={updateGameState}
                            value={game.newSize}
                        >
                            {selectOptions}
                        </select>
                    </label>
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <label className="form-check-label" htmlFor="easyMode">
                            <input
                                checked={game.easyMode}
                                className="form-check-input"
                                id="easyMode"
                                name="easyMode"
                                onChange={updateGameState}
                                type="checkbox"
                            />
                            Easy Mode - disables score
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="seed">
                        Optional seed for board generation, disables score:
                        <input
                            className="form-control"
                            id="seed"
                            maxLength={256}
                            name="seed"
                            onChange={updateGameState}
                            placeholder="myBoardToShareWithFriends"
                            type="text"
                            value={game.seed}
                        />
                    </label>
                </div>
            </form>
        </div>
    );
};
export default NewGamePanel;
