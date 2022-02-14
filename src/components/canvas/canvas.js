import React, {useEffect, useRef} from 'react';
import {useDispatch, useStore} from "../store/store";
/*
* //// column
* row
* */
function Canvas(props) {

    const {...rest} = props
    const canvasRef = useRef(null)
    const dispatch = useDispatch();
    const store = useStore();
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        console.log("init")
        dispatch({
            type: "canvasCtx",
            value: context,
        })
        drawTableHeader(context,store.tableInfo);
        // drawTableCell(context,store.tableInfo);
    }, [])

    useEffect(()=>{
        const canvas = canvasRef.current
        if (!!!store.canvasCtx) return;
        console.log("render")
        store.canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        store.canvasCtx.beginPath();
        drawTableHeader(store.canvasCtx,store.tableInfo);
        // drawTableCell(store.canvasCtx,store.tableInfo);
    },[store.tableInfo])

    return (
        <canvas ref={canvasRef} {...rest} />
    );
}

/*
* empty cell first
* can be adjust individul
* */
function drawTableHeader(ctx,tableInfo) {

    const {rowCount,columnCount,cellHeight,cellWidth,columnHeaderHeight,rowHeaderWidth,strokeWidth} = tableInfo;
    const sumHeight = rowCount * cellHeight + columnHeaderHeight + rowCount * strokeWidth; // sum height + empty header + border
    const sumWidth = columnCount * cellWidth + rowHeaderWidth + columnCount * strokeWidth;
    ctx.save();
    // draw header
    ctx.fillStyle = '#f4f5f8';
    ctx.fillRect(0, 0, rowHeaderWidth, sumHeight);
    ctx.fillRect(0, 0, sumWidth, columnHeaderHeight);
    ctx.restore();
    // draw split sign
    // col header
    let colIndex = 0;
    for (let i = 1; i <= columnCount; i++) {
        if (i === 1) {
            colIndex += rowHeaderWidth + strokeWidth
        } else {
            colIndex += cellWidth + strokeWidth;
        }
        drawLine(ctx,[colIndex, 0],[colIndex, columnHeaderHeight],'#e6e6e6',strokeWidth)
        drawText(ctx, String.fromCharCode(i + 64) ,  [colIndex + cellWidth / 2, columnHeaderHeight / 2]);
        ctx.stroke();
    }
    // row header
    let rowIndex = 0;
    for (let i = 1; i <= rowCount; i++) {
        if (i === 1) {
            rowIndex += columnHeaderHeight + strokeWidth
        } else {
            rowIndex += cellHeight + strokeWidth;
        }
        drawLine(ctx,[0, rowIndex],[rowHeaderWidth,  rowIndex],'#e6e6e6',strokeWidth)
        drawText(ctx, i ,  [rowHeaderWidth / 2, rowIndex + cellHeight  / 2]);
        ctx.stroke();
    }
}
function drawLine(ctx,lineFrom,lineTo,style,width) {
    ctx.lineWidth = width;
    ctx.strokeStyle =  style;
    ctx.moveTo(lineFrom[0], lineFrom[1]);
    ctx.lineTo(lineTo[0],  lineTo[1]);
}

function drawText(ctx,text,drawTo) {
    ctx.font = "10px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.fillText(text,drawTo[0],drawTo[1]);
}

function drawTableCell(ctx,tableInfo) {
    const {rowCount:rows,cellHeight:rowHeight,columnCount:columns,cellWidth:colWidth} = tableInfo;
    ctx.save();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            // set init position
            // ctx.translate(colWidth, rowHeight);
            // draw cell
            ctx.rect(j*(colWidth+0.5), i*(rowHeight+0.5), colWidth, rowHeight);
            // set background
            ctx.fillStyle =  '#fff';
            // border line
            ctx.lineWidth = 0.5;
            // set border color
            ctx.strokeStyle = '#e6e6e6';
            // set content fill color
            // ctx.fill();
            // draw
            ctx.stroke();
        }
    }
    ctx.restore();

}
export default Canvas;
