import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type {
    HighScore,
    NewGameResponse,
    WinGameResponse,
} from '@tiles-town/contracts';
import {
    applyMove,
    cloneBoard,
    countActiveTiles,
    createBoard,
    parseMoveCoordinates,
} from '@tiles-town/game-core';
import { GameState, PreviousGameState } from 'store/game/gameTypes';

const defaultSize = 6;
const defaultBoard = createBoard(defaultSize);
const initialPreviousGameState: PreviousGameState = {
    size: null,
    seed: '',
    moveCount: null,
    time: null,
    score: null,
    gameId: '',
    easyMode: null,
    isSeedCustom: null,
    playerName: '',
    moves: [],
};

export const initialGameState: GameState = {
    requestsCount: 0,
    board: cloneBoard(defaultBoard),
    receivedBoard: cloneBoard(defaultBoard),
    size: defaultSize,
    newSize: defaultSize,
    leftCount: countActiveTiles(defaultBoard),
    playerName: '',
    gameId: '',
    moveCount: 0,
    moves: [],
    seed: '',
    easyMode: false,
    highScores: [],
    isDisabled: true,
    firstTime: true,
    previous: initialPreviousGameState,
};

const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        beginRequest: (state) => {
            state.requestsCount += 1;
        },
        requestError: (state) => {
            state.requestsCount = Math.max(0, state.requestsCount - 1);
        },
        requestSuccess: (state) => {
            state.requestsCount = Math.max(0, state.requestsCount - 1);
        },
        replaceGame: (state, action: PayloadAction<NewGameResponse>) => {
            state.board = cloneBoard(action.payload.board);
            state.receivedBoard = cloneBoard(action.payload.board);
            state.gameId = action.payload.gameId;
            state.size = action.payload.size;
            state.leftCount = countActiveTiles(state.board);
            state.moves = [];
            state.moveCount = 0;
            state.firstTime = false;
        },
        makeMove: (state, action: PayloadAction<string>) => {
            state.moves.push(action.payload);
            state.moveCount += 1;
            applyMove(
                state.board,
                parseMoveCoordinates(action.payload, state.size),
            );
            state.leftCount = countActiveTiles(state.board);
        },
        storeWin: (state, action: PayloadAction<WinGameResponse>) => {
            state.previous = {
                size: state.size,
                seed: action.payload.seed ?? '',
                moveCount: action.payload.moveCount ?? null,
                time: action.payload.time ?? null,
                score: action.payload.score ?? null,
                gameId: state.gameId,
                easyMode: state.easyMode,
                isSeedCustom: action.payload.isSeedCustom ?? null,
                playerName: state.playerName,
                moves: [...state.moves],
            };
            state.moves = [];
            state.moveCount = 0;
            state.gameId = '';
        },
        restartBoard: (state) => {
            state.board = cloneBoard(state.receivedBoard);
            state.moves = [];
            state.moveCount = 0;
            state.leftCount = countActiveTiles(state.board);
        },
        lockBoard: (state) => {
            state.isDisabled = true;
        },
        unlockBoard: (state) => {
            state.isDisabled = false;
        },
        setPlayerName: (state, action: PayloadAction<string>) => {
            state.playerName = action.payload;
        },
        setSeed: (state, action: PayloadAction<string>) => {
            state.seed = action.payload;
        },
        setEasyMode: (state, action: PayloadAction<boolean>) => {
            state.easyMode = action.payload;
        },
        setNewSize: (state, action: PayloadAction<number>) => {
            state.newSize = action.payload;
        },
        setHighScores: (state, action: PayloadAction<HighScore[]>) => {
            state.highScores = action.payload;
        },
    },
});

export const {
    beginRequest,
    lockBoard,
    makeMove,
    replaceGame,
    requestError,
    requestSuccess,
    restartBoard,
    setEasyMode,
    setHighScores,
    setNewSize,
    setPlayerName,
    setSeed,
    storeWin,
    unlockBoard,
} = gameSlice.actions;

export const gameReducer = gameSlice.reducer;
