import { faTrophy, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement, useEffect } from 'react';

import styles from './highScores.scss';

import { useSelector, useDispatch } from 'store';
import { getHighScores as fetchHighScores } from 'store/game/gameActions';
import { getHighScores } from 'store/game/gameSelectors';

const HighScores = (): ReactElement => {
    const dispatch = useDispatch();
    const highScores = useSelector(getHighScores);

    useEffect(() => {
        void dispatch(fetchHighScores());
    }, [dispatch]);

    return (
        <div className={styles.highScores}>
            <h4>
                <FontAwesomeIcon icon={faTrophy} /> High Scores:
            </h4>
            <table>
                <thead>
                    <tr>
                        <th>
                            <FontAwesomeIcon icon={faHashtag} />
                        </th>
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
                            // eslint-disable-next-line react/no-array-index-key
                            <tr key={`${JSON.stringify(score)}_${i}`}>
                                <td>{i + 1}</td>
                                <td>{score.game_score}</td>
                                <td>{score.game_size}</td>
                                <td>{score.game_move_count}</td>
                                <td>
                                    {Math.trunc(score.game_time / 1000)}&nbsp;s
                                </td>
                                <td>{score.game_player_name}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default HighScores;
