import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as gameActions from '../../actions/gameActions';
import Board from './GameBoard';
import NewGamePanel from './NewGamePanel';
import HighScores from './HighScores';
import InfoPanels from './InfoPanels';
import Tile from './Tile';

export class GamePage extends React.Component {
    // constructor(props) {
    //     super(props);
    //     // this.onMoveClick = this.onMoveClick.bind(this);
    //     // this.onNewGameClick = this.onNewGameClick.bind(this);
    //     // this.updateGameState = this.updateGameState.bind(this);
    //     // this.restartBoard = this.restartBoard.bind(this);
    // }
    onMoveClick = event => {
        let coords = event.target.getAttribute('coords');
        Promise.resolve(this.props.actions.makeMove(coords))
            .then(() => {
                if (this.props.game.leftCount === 0) {
                    this.props.actions.winGame(this.props.game);
                }
            });
    }

    onNewGameClick = event => {
        event.preventDefault();
        this.props.actions.newGame(
            this.props.game.newSize,
            this.props.game.easyMode,
            this.props.game.seed,
            this.props.game.gameId
        );
    }
    updateGameState = event => {
        const name = event.target.name;
        let value;
        value = event.target.type == 'checkbox' ? event.target.checked : event.target.value;
        this.props.actions.updateOnChange(name, value);
    }
    restartBoard = event => {
        event.preventDefault();
        this.props.actions.restartBoard();
    }

    render() {
        return (
            <section className="gamePage">
                <div className="row">
                    <div className="col-sm-7 col-md-8 col-lg-9">
                        <Board game={this.props.game} onMoveClick={this.onMoveClick} />
                    </div>
                    <div className="col-sm-5 col-md-4 col-lg-3">
                        <div className="exampleBox">
                            {this.props.game.firstTime && <React.Fragment>
                                <p>Game objective: <span className="boldTip">flip every tile to the gray side.</span> Score is based on board size, time spent and amount of moves. Every single board is guaranteed to be solvable.</p>
                                <div className="example">
                                    <Tile type={1} coords={[3, 0]} size={8} isDisabled />
                                    &nbsp;
                                    <FontAwesomeIcon icon="arrow-right" />
                                    &nbsp;
                                    <Tile type={0} coords={[3, 0]} size={8} isDisabled />
                                </div>
                                <p className="boldTip">Start a new game to begin.</p>
                            </React.Fragment>}
                        </div>
                        <NewGamePanel
                            game={this.props.game}
                            onNewGameClick={this.onNewGameClick}
                            onChange={this.updateGameState}
                            onRestartClick={this.restartBoard}
                            loading={this.props.loading}
                        />
                    </div>
                </div>
                <div className="row justify-content-between">
                    <div className="col-sm-5 col-md-4 col-lg-3 order-sm-last">
                        <InfoPanels
                            game={this.props.game}
                        />
                    </div>
                    <div className="col-sm-7 col-md-8 col-lg-9">
                        <HighScores highScores={this.props.game.highScores} />
                    </div>
                </div>
            </section>
        );
    }
}

GamePage.propTypes = {
    game: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    loading: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        game: state.game,
        loading: state.ajaxCallsInProgress > 0
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(gameActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GamePage);
