import * as types from './actionTypes';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import toastr from 'toastr';

// const api = 'https://api.tiles.town';

export function newGame(newSize, easyMode, seed, previousId) {
    return dispatch => {
        dispatch(lockBoard());
        dispatch(beginAjaxCall());
        return fetch('/api/game/new', {
            timeout: 5000,
            method: 'post',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                'size': newSize,
                'easyMode': easyMode,
                'seed': seed,
                'previousId': previousId,
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
                return res;
            })
            .then(res => res.json())
            .then(newGame => {
                $('.toast-container').remove();
                toastr.success('New game loaded!', null, {
                    timeOut: 1000,
                    closeButton: false,
                    preventDuplicates: true
                });
                dispatch(newGameSuccess(newGame));
                // wait for DOM a tiny bit to prevent flip animation, otherwise it bugs out
                setTimeout(() => {
                    dispatch(unlockBoard());
                }, 20);
            })
            .catch(err => {
                toastr.error('Couldn\'t load a new game 😥 \n' + err);
                dispatch(ajaxCallError());
                throw (err);
            });
    };
}

export function newGameSuccess(newGame) {
    return {
        type: types.NEW_GAME_SUCCESS,
        newGame
    };
}

export function unlockBoard() {
    return {
        type: types.UNLOCK_BOARD
    };
}

export function lockBoard() {
    return {
        type: types.LOCK_BOARD
    };
}

export function makeMove(move) {
    return {
        type: types.MAKE_MOVE,
        move
    };
}

export function winGame(game) {
    return dispatch => {
        //console.log('winGame() action');
        dispatch(beginAjaxCall());
        return fetch('/api/game/' + game.gameId, {
            timeout: 20000,
            method: 'put',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                'moves': game.moves,
                'playerName': (() => {
                    if (!game.playerName) return 'anonymous';
                    return game.playerName;
                })()
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
                return res;
            })
            .then(res => res.json())
            .then(game => {
                let scoreMsg = '';
                if (game.score) {scoreMsg = 'Total score: ' + game.score + '</br>';}
                toastr.success(
                    scoreMsg,
                    '😎 Great job!',
                    {
                        timeOut: 2000,
                        extendedTimeOut: 0
                });
                dispatch(lockBoard());
                dispatch(winGameSuccess(game));
            })
            .then(game => {
                dispatch(getHighScores(game));
            })
            .catch(err => {
                toastr.error('Request error, your game wasn\'t saved 😥 \n' + err);
                dispatch(ajaxCallError());
                throw (err);
            });
    };
}

export function winGameSuccess(game) {
    return {
        type: types.WIN_GAME_SUCCESS,
        game
    };
}

export function updateOnChange(name, value) {
    return {
        type: types.UPDATE_ON_CHANGE,
        name,
        value
    };
}

export function getHighScores() {
    return dispatch => {
        //console.log('getHighScores() action');
        dispatch(beginAjaxCall());
        return fetch('/api/game/highScores', {
            timeout: 5000,
            method: 'get'
        })
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
                return res;
            })
            .then(res => res.json())
            .then(highScores => {
                dispatch(getHighScoresSuccess(highScores));
            })
            .catch(err => {
                toastr.error('Couldn\'t load high scores from the server 😥 \n Most likely Piotr turned off the server. \n' + err);
                dispatch(ajaxCallError());
                throw (err);
            });
    };
}

export function getHighScoresSuccess(highScores) {
    //console.log('getHighScoresSuccess() action');
    return {
        type: types.GET_HIGH_SCORES_SUCCESS,
        highScores
    };
}

export function restartBoard() {
    return {
        type: types.RESTART_BOARD
    };
}

