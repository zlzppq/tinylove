var board = new Array();
var flag = new Array();
var score = 0;

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;


$(document).ready(function () {
    prepareForMobile();
    newgame();
});

function prepareForMobile() {

    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}

function newgame()
{
    init();
    createOneNum();
    createOneNum();
}

function init()
{
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++)
        {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }

    for (var i = 0; i < 4; i++)
    {
        board[i] = new Array();
        flag[i] = new Array();
        for (var j = 0; j < 4; j++)
        {
            board[i][j] = 0;
            flag[i][j] = 0;
        }
    }
        
    updateBoard();
    score = 0;
    $("#score").text(score);
}

function updateBoard()
{
    $(".number-cell").remove();
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++)
        {
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if(board[i][j]==0)
            {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
            }
            else
            {
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumBgColor(board[i][j]));
                theNumberCell.css('color', getNumColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
        }

    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.6 * cellSideLength + 'px');

}

function createOneNum()
{
    if (noSpace(board)) return false;

    var randX = parseInt(Math.floor(Math.random() * 4));
    var randY = parseInt(Math.floor(Math.random() * 4));

    var times = 0;
    while (times<50)
    {
        if (board[randX][randY] == 0) break;
        randX = parseInt(Math.floor(Math.random() * 4));
        randY = parseInt(Math.floor(Math.random() * 4));

        times++;
    }
    if (times == 50) {
        for(var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                if(board[i][j]==0)
                {
                    randX = i;
                    randY = j;
                    break;
                }
    }

    var randNum = Math.random() < 0.5 ? 2 : 4;

    //console.log(randNum);

    board[randX][randY] = randNum;
    showNumAnimation(randX, randY, randNum);

    return true;
}

$(document).keydown(function(event)
{
    switch (event.keyCode) {
        case 37:
            if (moveLeft()) {
                setTimeout("createOneNum()", 210);
                setTimeout("isGameover()", 300);
            }
            break;
        case 38:
            if (moveUp()) {
                setTimeout("createOneNum()", 210);
                setTimeout("isGameover()", 300);
            }
            break;
        case 39:
            if (moveRight()) {
                setTimeout("createOneNum()", 210);
                setTimeout("isGameover()", 300);
            }
            break;
        case 40:
            if (moveDown()) {
                setTimeout("createOneNum()", 210);
                setTimeout("isGameover()", 300);
            }
            break;
    }
})

document.addEventListener("touchstart", function (event) {
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
});

document.addEventListener("touchend", function (event) {
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;

    var deltaX = endX - startX;
    var deltaY = endY - startY;
    
    if (Math.abs(deltaX) >= 10 || Math.abs(deltaY) >= 10) {
        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
            if (deltaX > 0) {
                if (moveRight()) {
                    setTimeout("createOneNum()", 210);
                    setTimeout("isGameover()", 300);
                }
            }
            else {
                if (moveLeft()) {
                    setTimeout("createOneNum()", 210);
                    setTimeout("isGameover()", 300);
                }
            }

        }
        else {
            if (deltaY > 0) {
                if (moveDown()) {
                    setTimeout("createOneNum()", 210);
                    setTimeout("isGameover()", 300);
                }
            }
            else {
                if (moveUp()) {
                    setTimeout("createOneNum()", 210);
                    setTimeout("isGameover()", 300);
                }
            }
        }
    }
});



function isGameover() {
    if(noSpace(board)&&noMove(board))
    {
        alert("Game Over!");
    }
}

function moveLeft()
{
    if (!canMoveLeft(board)) return false;

    for(var i=0;i<4;i++)
        for (var j = 1; j < 4; j++)
        {
            if (board[i][j] != 0)
            {
                for (var k = 0; k < j; k++)
                {
                    if (board[i][k] == 0 && noBlock1(i, k, j, board))
                    {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlock1(i, k, j, board) && flag[i][k]==0)
                    {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        flag[i][k] = 1;
                        score += board[i][k];
                        $("#score").text(score);

                        continue;
                    }
                }
            }
        }

    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            flag[i][j] = 0;
    
    setTimeout("updateBoard()", 200);
    return true;
}

function moveUp() {
    if (!canMoveUp(board)) return false;

    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlock2(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlock2(j, k, i, board) && flag[k][j] == 0)
                    {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        flag[k][j] = 1;
                        score += board[k][j];
                        $("#score").text(score);

                        continue;
                    }
                }
            }
        }

    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            flag[i][j] = 0;

    setTimeout("updateBoard()", 200);
    return true;
}

function moveRight() {
    if (!canMoveRight(board)) return false;

    for (var i = 0; i < 4; i++)
        for (var j = 2; j >=0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlock1(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlock1(i, j, k, board) && flag[i][k]==0)
                    {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        flag[i][k] = 1;
                        score += board[i][k];
                        $("#score").text(score);

                        continue;
                    }
                }
            }
        }

    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            flag[i][j] = 0;

    setTimeout("updateBoard()", 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board)) return false;

    for (var j = 0; j < 4; j++)
        for (var i = 2; i >=0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k >i; k--) {
                    if (board[k][j] == 0 && noBlock2(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlock2(j, i, k, board) && flag[k][j]==0)
                    {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        flag[k][j] = 1;
                        score += board[k][j];
                        $("#score").text(score);

                        continue;
                    }
                }
            }
        }

    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            flag[i][j] = 0;

    setTimeout("updateBoard()", 200);
    return true;
}
