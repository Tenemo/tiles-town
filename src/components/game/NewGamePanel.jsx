import React from 'react';
import PropTypes from 'prop-types';
import gameClientConfig from '../../../config/gameClientConfig';

const NewGamePanel = ({ game, onNewGameClick, onChange, onRestartClick, loading }) => {
    let selectOptions = [];
    for (let i = gameClientConfig.minSize; i < gameClientConfig.maxSize + 1; i++) {
        selectOptions.push(
            <option key={i} value={i}>{i}{i === 6 && ' - suggested'}</option>
        );
    }
    return (
        <div className="panel">
            <form className="simpleBox">
                <div className="form-group">
                    <input
                        className="btn btn-primary"
                        type="submit"
                        value={loading ? 'Loading...' : 'New Game'}
                        onClick={onNewGameClick}
                        disabled={loading}
                    />
                    <input
                        className="btn btn-primary"
                        type="submit"
                        value="Restart"
                        onClick={onRestartClick}
                        disabled={game.isDisabled}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="playerName">Player name to show on the scoreboard, anything goes:</label>
                    <input
                        className="form-control"
                        onChange={onChange}
                        value={game.playerName}
                        type="text"
                        name="playerName"
                        placeholder="anonymous"
                        maxLength="32"
                        />
                </div>
                <div className="form-group">
                    <label htmlFor="newSize">Board size: </label>
                    <select
                        className="form-control"
                        onChange={onChange}
                        value={game.newSize}
                        name="newSize">
                        {selectOptions}
                    </select>
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            onChange={onChange}
                            checked={game.easyMode}
                            type="checkbox"
                            name="easyMode"
                            id="easyMode" />
                        <label htmlFor="easyMode" className="form-check-label">Easy Mode - disables score</label>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="seed">Optional seed for board generation, disables score:</label>
                    <input
                        className="form-control"
                        onChange={onChange}
                        value={game.seed}
                        type="text"
                        name="seed"
                        placeholder="myBoardToShareWithFriends"
                        maxLength="256"
                        />
                </div>
            </form>
        </div>
    );
};

NewGamePanel.propTypes = {
    game: PropTypes.object,
    onNewGameClick: PropTypes.func,
    onRestartClick: PropTypes.func,
    onChange: PropTypes.func,
    loading: PropTypes.bool
};

export default NewGamePanel;