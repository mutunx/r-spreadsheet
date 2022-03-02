import {tab} from "@testing-library/user-event/dist/tab";

const drawEvents = {
    "Text": drawText,
    "DrawTable": drawTableHeader,
}
const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


function drawTableHeader(ctx, tableInfo, e = null) {
    const {
        rowCount,
        columnCount,
        cellHeight,
        cellWidth,
        columnHeaderHeight,
        rowHeaderWidth,
        strokeWidth,
        baseColor,
        hoverColor,
        lineColor,
        scroll
    } = tableInfo;
    // sum height + empty header + border
    const sumHeight = (rowCount - Object.keys(tableInfo.rowHeights).length) * cellHeight + columnHeaderHeight + rowCount * strokeWidth + Object.values(tableInfo.rowHeights).reduce((x,y)=>x+y);
    const sumWidth = (columnCount - Object.keys(tableInfo.colWidths).length) * cellWidth + rowHeaderWidth + columnCount * strokeWidth + Object.values(tableInfo.colWidths).reduce((x,y)=>x+y);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.save();
    // draw header
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, rowHeaderWidth, sumHeight);
    ctx.fillRect(0, 0, sumWidth, columnHeaderHeight);
    ctx.restore();
    // draw split sign
    // col header
    let colIndex = 0;
    for (let i = 0; i < columnCount ; i++) {
        let indexColumnWidth = cellWidth;
        if (Object.keys(tableInfo.colWidths).includes(i+"")) {
            indexColumnWidth = tableInfo.colWidths[i];
        }
        if (i === 0) {
            colIndex += rowHeaderWidth + strokeWidth
        } else {
            colIndex += indexColumnWidth + strokeWidth;
        }
        drawLine(ctx, [colIndex, 0], [colIndex, sumHeight], lineColor, strokeWidth)
        if (columnCount + 1 === i) break;
        if (e && e.offsetY < columnHeaderHeight && e.offsetX > rowHeaderWidth && Math.ceil((e.offsetX - rowHeaderWidth - strokeWidth) / (cellWidth + strokeWidth)) === i) {
            drawRect(ctx, [colIndex, 0], indexColumnWidth, columnHeaderHeight, hoverColor)
        }
        drawText(ctx, stringAt(scroll.ci + i ), [colIndex + indexColumnWidth / 2, columnHeaderHeight / 2]);
    }
    // row header
    let rowIndex = 0;
    for (let i = 0; i < rowCount + 1; i++) {
        let indexCellHeight = cellHeight;
        if (Object.keys(tableInfo.rowHeights).includes(i+"")) {
            indexCellHeight = tableInfo.rowHeights[i];
        }
        if (i === 0) {
            rowIndex += columnHeaderHeight + strokeWidth
        } else {
            rowIndex += indexCellHeight + strokeWidth;
        }

        if (rowCount + 1 === i) break;
        if (i > 0) {
            if (e && e.offsetX < rowHeaderWidth && e.offsetY > columnHeaderHeight && Math.ceil((e.offsetY - columnHeaderHeight - strokeWidth) / (cellHeight + strokeWidth)) === i) {
                drawRect(ctx, [0, rowIndex], rowHeaderWidth, indexCellHeight, hoverColor)
            }
            drawText(ctx, scroll.ri + i + 1, [rowHeaderWidth / 2, rowIndex + indexCellHeight / 2]);
        }
        drawLine(ctx, [0, rowIndex], [sumWidth, rowIndex], lineColor, strokeWidth)

    }
}

export default function canvasDraw(ctx, event, ...args) {
    if (!Object.keys(drawEvents).includes(event)) console.error("invalid event in drawEvent")
    return drawEvents[event](ctx, ...args);
}

function drawLine(ctx, lineFrom, lineTo, style, width) {
    ctx.save();
    ctx.lineWidth = width;
    ctx.strokeStyle = style;
    ctx.moveTo(lineFrom[0], lineFrom[1]);
    ctx.lineTo(lineTo[0], lineTo[1]);
    ctx.stroke();
    ctx.restore();
}

function drawRect(ctx, pos, width, height, style) {
    ctx.beginPath();
    ctx.rect(pos[0], pos[1], width, height);
    ctx.fillStyle = style;
    ctx.fill();
}

function drawText(ctx, text, drawTo) {
    ctx.beginPath();
    ctx.font = "10px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.fillStyle = "#000000"
    ctx.fillText(text, drawTo[0], drawTo[1]);
}

function stringAt(index) {
    let str = '';
    let cIndex = index;
    while (cIndex >= alphabets.length) {
        cIndex /= alphabets.length;
        cIndex -= 1;
        str += alphabets[parseInt(cIndex, 10) % alphabets.length];
    }
    const last = index % alphabets.length;
    str += alphabets[last];
    return str;
}
