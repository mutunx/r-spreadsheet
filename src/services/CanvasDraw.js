import {pos2offset, transCords2CellIndexAndOffset} from "./CanvasEvents";
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
        scroll,
        rowHeights,
        colWidths,
    } = tableInfo;
    // sum height + empty header + border
    const sumHeight = (rowCount - Object.keys(tableInfo.rowHeights).length) * cellHeight + columnHeaderHeight + rowCount * strokeWidth + Object.values(tableInfo.rowHeights).reduce((x,y)=>x+y);
    const sumWidth = (columnCount - Object.keys(tableInfo.colWidths).length) * cellWidth + rowHeaderWidth + columnCount * strokeWidth + Object.values(tableInfo.colWidths).reduce((x,y)=>x+y);
    const header = {
        width: rowHeaderWidth + strokeWidth,
        height: columnHeaderHeight + strokeWidth,
    }
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
    let colIndex = rowHeaderWidth + strokeWidth;
    for (let i = 0; i < columnCount ; i++) {
        let indexColumnWidth = cellWidth;
        if (Object.keys(tableInfo.colWidths).includes(scroll.ci + i+"")) {
            indexColumnWidth = tableInfo.colWidths[scroll.ci + i];
        }
        drawLine(ctx, [colIndex, 0], [colIndex, sumHeight], lineColor, strokeWidth)
        if (columnCount  === i) break;
        if (e) {
            const {posIndex} =  transCords2CellIndexAndOffset(e.offsetX,header.width,window.screen.width,scroll.ci,colWidths,cellWidth + strokeWidth);
            if (e.offsetY < columnHeaderHeight && e.offsetX > rowHeaderWidth && posIndex === scroll.ci + i) {
                drawRect(ctx, [colIndex, 0], indexColumnWidth, columnHeaderHeight, hoverColor)
            }
        }
        drawText(ctx, stringAt(scroll.ci + i ), [colIndex + indexColumnWidth / 2, columnHeaderHeight / 2],"",'header');
        colIndex += indexColumnWidth + strokeWidth;
    }
    // row header
    let rowIndex = columnHeaderHeight + strokeWidth;
    for (let i = 0; i < rowCount + 1; i++) {
        let indexCellHeight = cellHeight;
        if (Object.keys(tableInfo.rowHeights).includes(scroll.ri + i +"")) {
            indexCellHeight = tableInfo.rowHeights[scroll.ri + i];
        }
        if (rowCount  === i) break;
        if (e) {
            const {posIndex} = transCords2CellIndexAndOffset(e.offsetY,header.height,window.screen.height,scroll.ri,rowHeights,cellHeight + strokeWidth)
            if (e.offsetX < rowHeaderWidth && e.offsetY > columnHeaderHeight && posIndex === scroll.ri + i) {
                drawRect(ctx, [0, rowIndex], rowHeaderWidth, indexCellHeight, hoverColor)
            }
        }
        drawText(ctx, scroll.ri + i + 1, [rowHeaderWidth / 2, rowIndex + indexCellHeight / 2],"",'header');
        drawLine(ctx, [0, rowIndex], [sumWidth, rowIndex], lineColor, strokeWidth)
        rowIndex += indexCellHeight + strokeWidth;
    }

    for(let r = 0; r < tableInfo.rowCount; r++) {
        if (!!!tableInfo.rows[r]) continue;
        for (let c = 0; c <= tableInfo.columnCount; c++) {
            if (!!!tableInfo.rows[r].cols[c]) continue;
            let {offset:offsetY ,size:height} = pos2offset(r,scroll.ri,scroll.ri + 24,tableInfo.rowHeights,tableInfo.cellHeight,tableInfo.strokeWidth);
            if(offsetY === -1) continue;
            // add header
            offsetY +=  tableInfo.columnHeaderHeight + tableInfo.strokeWidth;
            // add self size to set font can set align to bottom
            offsetY += height + tableInfo.strokeWidth;
            let {offset:offsetX,size:width} = pos2offset(c,scroll.ci,scroll.ci + 18,tableInfo.colWidths,tableInfo.cellWidth,tableInfo.strokeWidth);
            if(offsetX === -1) continue;
            offsetX += tableInfo.rowHeaderWidth + tableInfo.strokeWidth;
            drawText(ctx,tableInfo.rows[r].cols[c].text,[offsetX,offsetY],tableInfo.rows[r].cols[c].type ?? '')
            // drawRect(ctx,[offsetX,offsetY],width,height,"#666666")
        }
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

function drawText(ctx, text, drawTo,fontType,drawType = "cell") {
    ctx.beginPath();
    ctx.font = fontType +" 15px Comic Sans MS";
    ctx.textAlign = "left";
    ctx.textBaseline = 'bottom';
    if (drawType === 'header') {
        ctx.font = ctx.font.replace(/\d+px/, "10px");
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
    }
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
