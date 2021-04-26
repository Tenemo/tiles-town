import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HighScores = ({ highScores }) => {
    return (
        <div className="highScores">
            <h4><FontAwesomeIcon icon="trophy"/> High Scores:</h4>
            <table>
                <thead>
                    <tr>
                        <th><FontAwesomeIcon icon="hashtag"/></th>
                        <th>Score</th>
                        <th>Size</th>
                        <th>Moves</th>
                        <th>Time</th>
                        <th>Player name</th>
                    </tr>
                </thead>
                <tbody>
                {highScores.map((score, i) => {
                    return (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{score.game_score}</td>
                            <td>{score.game_size}</td>
                            <td>{score.game_move_count}</td>
                            <td>{Math.trunc(score.game_time / 1000)}&nbsp;s</td>
                            <td>{score.game_player_name}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

HighScores.propTypes = {
    highScores: PropTypes.array
};

export default HighScores;