import React, {useCallback, useEffect, useRef, useState} from 'react';
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
        const canvas = canvasRef.current;
        canvas.onmousemove = (e) => {
            clear(canvas);
            drawTableHeader(canvas.getContext("2d"),store.tableInfo,e);
        }
        const context = canvas.getContext('2d')
        console.log("init")
        dispatch({
            type: "canvasCtx",
            value: context,
        })
        drawTableHeader(context,store.tableInfo);
        window.onresize = (e) => {
            context.canvas.width = window.innerWidth;
            context.canvas.height = window.innerHeight - 80;
            drawTableHeader(context,store.tableInfo);
        }
    }, [])

    useEffect(()=>{
        const canvas = canvasRef.current
        if (!!!store.canvasCtx) return;
        canvas.onmousemove = (e) => {
            clear(canvas);
            drawTableHeader(canvas.getContext("2d"),store.tableInfo,e);
        }
        console.log("render")
        clear(canvas);
        drawTableHeader(store.canvasCtx,store.tableInfo);
    },[store.tableInfo])

    return (
        <canvas ref={canvasRef} {...rest} />
    );
}



function clear(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
}
/*
* empty cell first
* can be adjust individul
* */
function drawTableHeader(ctx,tableInfo,e=null) {

    const {rowCount,columnCount,cellHeight,cellWidth,columnHeaderHeight,rowHeaderWidth,strokeWidth,baseColor,hoverColor,lineColor} = tableInfo;
    const sumHeight = rowCount * cellHeight + columnHeaderHeight + rowCount * strokeWidth; // sum height + empty header + border
    const sumWidth = columnCount * cellWidth + rowHeaderWidth + columnCount * strokeWidth;
    ctx.save();
    // draw header
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, rowHeaderWidth, sumHeight);
    ctx.fillRect(0, 0, sumWidth, columnHeaderHeight);
    ctx.restore();
    // draw split sign
    // col header
    let colIndex = 0;
    for (let i = 1; i <= columnCount +1; i++) {
        if (i === 1) {
            colIndex += rowHeaderWidth + strokeWidth
        } else {
            colIndex += cellWidth + strokeWidth;
        }
        drawLine(ctx,[colIndex, 0],[colIndex, sumHeight],lineColor,strokeWidth)
        if (columnCount +1 === i) break;
        if (e && e.offsetY < columnHeaderHeight && e.offsetX > rowHeaderWidth && Math.ceil((e.offsetX - rowHeaderWidth - strokeWidth) / (cellWidth+strokeWidth) ) ===i) {
            drawRect(ctx,[colIndex,0],cellWidth,columnHeaderHeight,hoverColor)
        }
        drawText(ctx, String.fromCharCode(i + 64) ,  [colIndex + cellWidth / 2, columnHeaderHeight / 2]);
    }
    // row header
    let rowIndex = 0;
    for (let i = 1; i <= rowCount+1; i++) {
        if (i === 1) {
            rowIndex += columnHeaderHeight + strokeWidth
        } else {
            rowIndex += cellHeight + strokeWidth;
        }
        drawLine(ctx,[0, rowIndex],[sumWidth,  rowIndex],lineColor,strokeWidth)
        if (rowCount +1 === i) break;
        if (e && e.offsetX < rowHeaderWidth && e.offsetY > columnHeaderHeight && Math.ceil((e.offsetY - columnHeaderHeight - strokeWidth) / (cellHeight + strokeWidth) ) === i) {
            drawRect(ctx,[0,rowIndex],rowHeaderWidth,cellHeight,hoverColor)
        }
        drawText(ctx, i ,  [rowHeaderWidth / 2, rowIndex + cellHeight  / 2]);

    }
}
function drawLine(ctx,lineFrom,lineTo,style,width) {
    ctx.save();
    ctx.lineWidth = width;
    ctx.strokeStyle =  style;
    ctx.moveTo(lineFrom[0], lineFrom[1]);
    ctx.lineTo(lineTo[0],  lineTo[1]);
    ctx.stroke();
    ctx.restore();
}
function drawRect(ctx,pos,width,height,style) {
    ctx.beginPath();
    ctx.rect(pos[0],pos[1],width,height);
    ctx.fillStyle=style;
    ctx.fill();
}
function drawText(ctx,text,drawTo) {
    ctx.beginPath();
    ctx.font = "10px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.fillStyle="#000000"
    ctx.fillText(text,drawTo[0],drawTo[1]);
}


export default Canvas;
