import React, {useCallback, useEffect, useRef, useState} from 'react';
import Canvas from "../canvas/canvas";
import canvasEvents from "../../services/CanvasEvents";
import {useDispatch, useStore} from "../store/store";

function Sheet(props) {

    let canvas = null;
    const store = useStore();
    const dispatch = useDispatch();
    const [resizeHorPos,setResizeHorPos] = useState(0);
    const [outOfCanvasY,setOutOfCanvasY] = useState(0);
    const [resizeVerPos,setResizeVerPos] = useState(0);
    const [resizeShow,setResizeShow] = useState("");
    const resizeHor = useRef(null);

    useEffect(()=>{
        canvas.current.onwheel = canvasEvents(canvas.current.getContext("2d"),"onwheel", store.tableInfo,dispatch);
    }, [canvas])

    function setCanvas(canvasRef) {
        canvas = canvasRef;
        setOutOfCanvasY(canvas.current.offsetTop);

    }

    function resizerHandler(e) {
        const {
            cellHeight,
            cellWidth,
            columnHeaderHeight,
            rowHeaderWidth,
            strokeWidth,
        } = store.tableInfo;
        // console.log(e.nativeEvent.offsetY , columnHeaderHeight ,e.nativeEvent.offsetX , rowHeaderWidth)
        if (e && e.nativeEvent.offsetY < columnHeaderHeight && e.nativeEvent.offsetX > rowHeaderWidth) {
            const colIndex = Math.ceil((e.nativeEvent.offsetX - rowHeaderWidth - strokeWidth) / (cellWidth + strokeWidth))
            const left = colIndex * (cellWidth + strokeWidth) + (rowHeaderWidth + strokeWidth) - 4 ;
            setResizeHorPos(left);
            setResizeVerPos(outOfCanvasY);
            setResizeShow("hor");
        } else if (e && e.nativeEvent.offsetX < rowHeaderWidth && e.nativeEvent.offsetY > columnHeaderHeight){
            const rowIndex =  Math.ceil((e.nativeEvent.offsetY - columnHeaderHeight - strokeWidth) / (cellHeight + strokeWidth));
            const top = outOfCanvasY + rowIndex * (cellHeight + strokeWidth) + (columnHeaderHeight + strokeWidth) - 4;
            console.log(rowIndex,top)
            setResizeVerPos(top);
            setResizeHorPos(0);
            setResizeShow("ver");
        } else {
            setResizeShow("")
        }
    }

    const moveFn =  useCallback((e) => {
        setResizeHorPos(e.clientX);
    },[]);

    function horResizeDown(e) {
        const el=resizeHor.current
        el.addEventListener('mousemove',moveFn);
    }

    function horResizeUp(e) {
        const el=resizeHor.current
        console.log(e.clientX);
        el.removeEventListener('mousemove',moveFn);
    }

    return (
        <>
            <Canvas setCanvas={setCanvas} onMouseMove={resizerHandler} width={document.documentElement.clientWidth} height={document.documentElement.clientHeight - 80} />
            <div ref={resizeHor} onMouseDown={horResizeDown} onMouseUp={horResizeUp} className={`w-2 hover:w-2.5 absolute bg-amber-200 cursor-col-resize`} style={{display:resizeShow ==="hor"?"block":"none",left:`${resizeHorPos}px`,top:`${resizeVerPos}px`,height:`${store.tableInfo.columnHeaderHeight}px`}}  />
            <div  className={`h-2 hover:h-2.5 absolute bg-amber-200 cursor-row-resize`} style={{display:resizeShow ==="ver"?"block":"none",left:`${resizeHorPos}px`,top:`${resizeVerPos}px`,width:`${store.tableInfo.rowHeaderWidth}px`}}  />
        </>

    );
}

export default Sheet;
