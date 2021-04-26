import React from 'react';
import PropTypes from 'prop-types';

const Panel = ({ game }) => {
    return (
        <div className="panel">
            <div className="simpleBox">
                {game.moveCount != null && game.moveCount != 0 && <p>
                    Move count: {game.moveCount}
                </p>}
            </div>
            <div className="simpleBox">
                {game.previous.gameId &&
                    <React.Fragment>
                        <h5>Previous Won Game</h5>
                    </React.Fragment>
                }
                {game.previous.score && <div>
                    Score: {game.previous.score}
                </div>}
                {game.previous.size &&
                    <div>Size: {game.previous.size}
                    </div>}
                {game.previous.moveCount && <div>
                    Move count: {game.previous.moveCount}
                </div>}
                {game.previous.time && <div>
                    Time: {Math.trunc(game.previous.time / 1000)} s
                </div>}
                {game.previous.seed && <div>
                    Seed: {game.previous.seed}
                </div>}
                {game.previous.moves != null && game.previous.moves.length !== 0 && <p className="moves">
                    Moves made: {game.previous.moves.map((move, i) => <React.Fragment key={i}>{!!i && ', '}{move}</React.Fragment>)}
                </p>}
            </div>
        </div>
    );
};

Panel.propTypes = {
    game: PropTypes.object,
};

export default Panel;