/* eslint-disable */

$(document).ready(function() {

    // COLORS
    blocked = "rgb(85,85,85)";
    inactive = "lightblue";
    clicked = "rgb(197, 255, 127)";

    var left;
    var clickCount = 0;

    var DEBUG = false;

    function reverseColor(x, y) {
        var target = $("[data-x="+ x +"][data-y="+ y +"]");
        if (target.attr("style") == "background-color: " + inactive + ";") {
            target.css("background-color", clicked);
            left--;
        } else if (target.attr("style") == "background-color: " + clicked + ";") {
            target.css("background-color", inactive);
            left++;
        }
    }

    function win() {
        clearInterval(timerID);
        userTime = $("#timer").text();
        $("footer > form").css("visibility", "visible").css("position", "static");
        $("aside, section, nav").css("visibility", "hidden").css("position", "absolute");
        $("#restart").css("visibility", "visible").css("position", "static");
        $("footer").prepend("<div>" + 
        "Wygrałeś.<br>" +
        "Ilość kliknięć: " + clickCount + "<br>" +
        "Twój czas: " + userTime + " s<br>" +
        "Plansza: " + size + " x " + size + "<br>" +
        "</div>");
    }

    function cross(x, y) {
        reverseColor(x, y);
        reverseColor(x + 1, y);
        reverseColor(x - 1, y);
        reverseColor(x, y + 1);
        reverseColor(x, y - 1);
        clickCount++;
        if (left < 1) {
            win();
        }
    }

    function block(x, y) {
        $("[data-x="+ x +"][data-y="+ y +"]").css("background-color", blocked);
    }

// ======= BOARD GENERATOR BEGIN ======= 

    function generateCross(size, y, x) {
        board[y][x] = 1;
        blank--;

        // this part checks if side squares were actually generated or were outside board bounds
        // it decrements the counter for each square generated
        if (y - 1 > -1) {
            if (board[y - 1][x] === 0) blank--;
            board[y - 1][x] = 1;
        }
        if (x - 1 > -1) {
            if (board[y][x - 1] === 0) blank--;
            board[y][x - 1] = 1;
        }
        if (y + 1 < size) {
            if (board[y + 1][x] === 0) blank--;
            board[y + 1][x] = 1;
        }
        if (x + 1 < size) {
            if (board[y][x + 1] === 0) blank--;
            board[y][x + 1] = 1;
        }


        // this flips existing squares and whatnot
        // it works great but i forgot how 15 minutes after writing and debugging this
        for (var i = -1; i < 2; i += 2) {
            if (y + i > -1 && y + i < size && x + i > -1 && x + i < size) {
                if (board[y + i][x + i] === 0) {
                    board[y + i][x + i] = 2;
                    blank--;
                }
            }
            if (y - i > -1 && y - i < size && x + i > -1 && x + i < size) {
                if (board[y - i][x + i] === 0) {
                    board[y - i][x + i] = 2;
                    blank--;
                }
            }
        }
        for (var j = -2; j < 3; j += 4) {
            if (x + j > -1 && x + j < size) {
                if (board[y][x + j] === 0) {
                    board[y][x + j] = 2;
                    blank--;
                }
            }
            if (y + j > -1 && y + j < size) {
                if (board[y + j][x] === 0) {
                    board[y + j][x] = 2;
                    blank--;
                }
            }
        }
    }

    function nextStep(board) {
        randN = Math.floor(Math.random() * blank) + 1;
        var y = 0;
        var x = 0;
        var i = 0;
        if (randN !== 1 || board[0][0] !== 0) {
            do {
                if (board[y][x] === 0) {
                    i++;
                }
                if (i == randN) {
                    generateCross(size, y, x);
                }
                if (x == size - 1) {
                    x = 0;
                    y++;
                } else {
                    x++;
                }
            } while (i < randN);
        } else {
            generateCross(size, y, x);
        }
    }

    function mixIns(size, board) {
        mix1 = [
            [0,0,2,2,0,0],
            [0,2,1,1,2,0],
            [2,1,1,1,1,2],
            [2,1,1,1,1,2],
            [0,2,1,1,2,0],
            [0,0,2,2,0,0]
        ];

        randMixY = Math.floor(Math.random() * (size - mix1.length + 3));
        randMixX = Math.floor(Math.random() * (size - mix1.length + 3));

        for (var i = 0; i < mix1.length; i++){
            for (var j = 0; j < mix1[i].length; j++){
                if (randMixY + i - 1 > -1 && randMixY + i - 1 < size && randMixX + j - 1 > -1 && randMixX + j - 1 < size) {
                    //console.log([randMixY + i - 1] + ", " + [randMixX + j - 1] + " = " + mix1[i][j]);
                    board[randMixY + i - 1][randMixX + j - 1] = mix1[i][j];
                    if (mix1[i][j] !== 0) blank--;
                }
            }
        }
    }

    function generate(size) {
        board = [];
        blank = size*size;
        for (var i = 0; i < size; i++) {
            board[i] = [];
            for (var j = 0; j < size; j++) {
                board[i][j] = 0;
            }
        }
        mixIns(size, board);

        while (blank > 0) {
            nextStep(board);
        }
        return board;
    }

    // DEBUG =======

    function generateDebug(size) {
        board = [];
        blank = size*size;
        for (var i = 0; i < size; i++) {
            board[i] = [];
            for (var j = 0; j < size; j++) {
                board[i][j] = 0;
            }
        }

        // while (blank > 0) {
        //     nextStepDebug(board);
        // }
        
        return board;
    }

    function nextStepDebug(board) {
        randN = Math.floor(Math.random() * blank) + 1;
        var y = 0;
        var x = 0;
        var i = 0;
        if (randN !== 1 || board[0][0] !== 0) {
            do {
                if (board[y][x] === 0) {
                    i++;
                }
                if (i == randN) {
                    console.log("HIT: " + y + ", " + x);
                    generateCross(size, y, x);
                }
                if (x == size - 1) {
                    x = 0;
                    y++;
                } else {
                    x++;
                }
            } while (i < randN);
        } else {
            console.log("HIT: " + y + ", " + x);
            generateCross(size, y, x);
        }
        display();
        console.log("Blank left: " + blank);
        initialize(board);
    }

    function display() {
        temp = board;
        xArray = [];
        for (var k = 0; k < temp.length; k++) {
            xArray[k] = k;
        }
        temp.unshift(xArray);
        for (var l = 0; l < temp.length; l++)
        {
            if (l === 0) {
                console.log("0" + " " + temp[l].toString() + "\n");
            } else{
                console.log((l-1) + " " + temp[l].toString() + "\n");
            }
        }
        temp.shift();
    }

    if (DEBUG === true) {
        $("header > button").css("visibility", "visible").css("position", "static");
        $('#nextStep').click(function() {
            if (blank > 0) nextStepDebug(board);
        });
        $('#hax').click(function() {
            win();
        });
    }

// ======= BOARD GENERATOR END ======= 

    function clear() {
        $("#gameContainer > div").each(function(){
            if ($(this).attr("style") == "background-color: " + clicked + ";") {
                $(this).css("background-color", inactive);
                left++;
            }
        });
        $("aside h2").remove();
    }

    function start() {
        size = $('#sizeMain').find(":selected").val();
        if ("undefined" !== typeof timerID) clearInterval(timerID);
        if (size != "placeholder") {
            $("#errorStart").text("");
            $('section, aside').css("visibility", "visible").css("position", "static");
            if (DEBUG === true) {
            initialize(generateDebug(parseInt(size)));
            } else {
            initialize(generate(parseInt(size)));
            }
            var time = new Date;
            timerID = 0;
            timerID = setInterval(function() {
                $("#timer").text((new Date - time) / 1000);
            }, 10);
        } else {
            $("#errorStart").text("Choose board size");
        }
    }

    function initialize(board) {
        left = 0;
        var game = $("#gameContainer");
        game.css("min-width", size*52 + "px");
        $("#gameContainer > div").remove();
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (board[i][j] == 1) {
                    game.append($("<div></div>").attr("data-y", i).attr("data-x", j)
                        .css("background-color", inactive));
                    left++;
                } else {
                    game.append($("<div></div>").attr("data-y", i).attr("data-x", j)
                        .css("background-color", blocked));
                }
            }
            game.append("</br>");
        }
        $("div[style='background-color: " + inactive + ";']").click(function() {
            var x = parseInt($(this).attr("data-x"));
            var y = parseInt($(this).attr("data-y"));
            cross(x, y);
        });
    }

    function populateTable() {
        sizeTable = $('#tableDropdown').find(":selected").val();
        $("#scoreboard tr:gt(0)").remove();
        retrievedDataArray = [];
        for (var i = 0; i < localStorage.length; i++){
            retrievedData = JSON.parse(localStorage.getItem(localStorage.key(i)));
            retrievedDataArray[i] = retrievedData;
        }

        if (sizeTable === "all") {
            retrievedDataArray.sort(function(a, b){
                var n = b.boardSize - a.boardSize;
                if (n !== 0) {
                    return n;
                }
                return a.userTime - b.userTime;
            });
        } else {
            retrievedDataArray.sort(function(a, b){
                return a.userTime - b.userTime;
            });
        }

        for (var j = 0; j < retrievedDataArray.length; j++) {
            if (retrievedDataArray[j].boardSize == sizeTable || sizeTable === "all") {
                $("#scoreboard").append(
                    "<tr>" +
                    "<td>" + (j + 1) + "</td>" +
                    "<td>" + retrievedDataArray[j].nick + "</td>" +
                    "<td>" + retrievedDataArray[j].boardSize + " x " + retrievedDataArray[j].boardSize + "</td>" +
                    "<td>" + retrievedDataArray[j].userTime + "</td>" +
                    "<td>" + retrievedDataArray[j].clickCount + "</td>" +
                    "</tr>"
                );
            }
        }
    }

    $('#clear').click(function() {
        clear();
    });

    $('#start').click(function() {
        start();
    });

    $('#clearData').click(function() {
        localStorage.clear();
    });

    $('#restart').click(function() {
        location.reload();
    });

    $("#tableDropdown").change(function () {
        populateTable();
    });

    $('#end').click(function (event) {
        //event.preventDefault();
        if(!$('#nick').val()) {
            $("#errorEnd").text("Wpisz nick");
        } else {
            $("#errorEnd").text("");
            nick = $('#nick').val();
            boardData = "";
            binaryBoard = "";
            for (var i = 0; i < size; i++) {
                for (var j = 0; j < size; j++) {
                    binaryBoard = binaryBoard.concat(board[i][j].toString());
                    boardData = parseInt(binaryBoard, 2).toString(16);
                }
            }
            score = {
                'timestamp': new Date,
                'nick': nick,
                'boardData': binaryBoard,
                'boardSize': parseInt(size),
                'userTime': userTime,
                'clickCount': clickCount
            };
            localStorage.setItem(new Date, JSON.stringify(score));
            populateTable();
            $("footer > form").css("visibility", "hidden").css("position", "absolute");
        }
        return false;
    });

    $("#sizeMain").append($("<option></option>").attr("selected", "selected").attr("value", "placeholder").text("choose..."));
    $("#tableDropdown").append($("<option></option>").attr("selected", "selected").attr("value", "all").text("all"));
    for (var i = 4; i < 26; i++) {
        $(".sizeDropdown").append($("<option></option>").attr("value", i).text(i + " x " + i));
    }
    populateTable();
});