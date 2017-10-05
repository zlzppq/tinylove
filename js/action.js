function  showNumAnimation(i,j,randNum)
{
    var numberCell = $('#number-cell-' + i + '-' + j);

    numberCell.css('background-color', getNumBgColor(randNum));
    numberCell.css('color', getNumColor(randNum));
    numberCell.text(randNum);

    //console.log(randNum);
    //console.log(i);
    //console.log(j);
    //console.log(numberCell);

    numberCell.animate({
        width: cellSideLength,
        height: cellSideLength,
        top: getPosTop(i, j),
        left: getPosLeft(i, j)
    }, 50);
}

function showMoveAnimation(fromX,fromY,toX,toY)
{
    var numberCell = $('#number-cell-' + fromX + '-' + fromY);

    numberCell.animate({
        top: getPosTop(toX, toY),
        left: getPosLeft(toX, toY)
    }, 200);
}