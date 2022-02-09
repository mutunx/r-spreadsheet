import React, {useEffect, useRef} from 'react';
import {useDispatch, useStore} from "../store/store";

function Canvas(props) {

    const {...rest} = props
    const canvasRef = useRef(null)
    const dispatch = useDispatch();
    const store = useStore();
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        dispatch({
            type: "canvasCtx",
            value: context,
        })
        drawTableHeader(context,store.tableInfo);
        drawTableCell(context,store.tableInfo);
    }, [])

    return (
        <canvas ref={canvasRef} {...rest} />
    );
}
function drawTableHeader(ctx,tableInfo) {

    const {rowCount:rows,cellHeight:rowHeight,columnCount:columns,cellWidth:colWidth} = tableInfo;
    const sumHeight = rows * rowHeight + rowHeight + rows * 0.5;
    const sumWidth = columns * colWidth + colWidth + columns * 0.5;
    ctx.save();
    // draw header
    ctx.fillStyle = '#f4f5f8';
    ctx.fillRect(0, 0, colWidth, sumHeight);
    ctx.fillRect(0, 0, sumWidth, rowHeight);
    ctx.restore();
    // draw split sign
    // col header
    for (let i = 1; i <= columns; i++) {
        ctx.strokeStyle =  '#e6e6e6';
        ctx.moveTo((colWidth + 0.5) * i, 0);
        ctx.lineTo((colWidth + 0.5) * i, rowHeight);
        ctx.fillText( String.fromCharCode(i + 64)  , (colWidth + 0.5) * i + colWidth / 2, rowHeight / 2)
        ctx.stroke();
    }
    // row header
    for (let i = 1; i <= rows; i++) {
        ctx.strokeStyle =  '#e6e6e6';
        ctx.moveTo(0, (rowHeight + 0.5) * i);
        ctx.lineTo(colWidth,  (rowHeight + 0.5) * i);
        ctx.fillText( i ,  colWidth / 2, (rowHeight + 0.5) * i + rowHeight / 2)
        ctx.stroke();
    }
}

function drawTableCell(ctx,tableInfo) {
    const {rowCount:rows,cellHeight:rowHeight,columnCount:columns,cellWidth:colWidth} = tableInfo;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            ctx.save();
            // set init position
            ctx.translate(colWidth, rowHeight);
            // draw cell
            ctx.rect(j*(colWidth+0.5), i*(rowHeight+0.5), colWidth, rowHeight);
            // set background
            ctx.fillStyle =  '#fff';
            // border line
            ctx.lineWidth = 0.5;
            // set border color
            ctx.strokeStyle = '#e6e6e6';
            // set content fill color
            ctx.fill();
            // draw
            ctx.stroke();
            ctx.restore();
        }
    }
}
export default Canvas;
