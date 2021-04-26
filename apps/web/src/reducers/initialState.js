const defaultSize = 6;
const defaultBoard = [];
for (let i = 0; i < defaultSize; i++) {
    defaultBoard.push([]);
    for (let j = 0; j < defaultSize; j++) {
        defaultBoard[i].push(0);
    }
}
export default {
    app: {
        theme: 'theme-light',
        darkTheme: false
    },
    game: {
        board: defaultBoard,
        receivedBoard: [],
        size: defaultSize,
        newSize: defaultSize,
        leftCount: null,
        playerName: '',
        gameId: '',
        moveCount: 0,
        moves: [],
        seed: '',
        easyMode: false,
        highScores: [],
        isDisabled: true,
        firstTime: true,
        previous: {
            size: null,
            seed: '',
            moveCount: null,
            time: null,
            score: null,
            gameId: '',
            easyMode: null,
            isSeedCustom: null,
            playerName: '',
            moves: []
        }
    },
    ajaxCallsInProgress: 0
};
