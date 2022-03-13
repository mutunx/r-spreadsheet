import React, {useCallback, useEffect, useRef, useState} from 'react';
import Canvas from "../canvas/canvas";
import {canvasEvents,transCords2CellIndexAndOffset} from "../../services/CanvasEvents";
import {useDispatch, useStore} from "../store/store";

function Sheet() {

    let canvas = null;
    const store = useStore();
    const dispatch = useDispatch();
    const [resizeHorPos,setResizeHorPos] = useState(0);
    const [selector,setSelector] = useState({width:0,height:0,left:0,top:0});
    const [outOfCanvasY,setOutOfCanvasY] = useState(0);
    const [resizeVerPos,setResizeVerPos] = useState(0);
    const [resizeShow,setResizeShow] = useState("");
    const [resizeBarPos,setResizeBarPos] = useState({index:0,pos:0})
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
            rowHeights,
            colWidths,
            scroll,
        } = store.tableInfo;
        const header = {
            width: rowHeaderWidth + strokeWidth,
            height: columnHeaderHeight + strokeWidth,
        }
        if (resizeBarPos.index !== 0) {
            return;
        }
        if (e && e.nativeEvent.offsetY < columnHeaderHeight && e.nativeEvent.offsetX > rowHeaderWidth) {
            const {posOffset,posSize} =  transCords2CellIndexAndOffset(e.nativeEvent.offsetX,header.width,window.screen.width,scroll.ci,colWidths,cellWidth + strokeWidth);
            setResizeHorPos(posOffset+posSize);
            setResizeVerPos(outOfCanvasY);
            setResizeShow("hor");
        } else if (e && e.nativeEvent.offsetX < rowHeaderWidth && e.nativeEvent.offsetY > columnHeaderHeight){
            const {posOffset,posSize} =  transCords2CellIndexAndOffset(e.nativeEvent.offsetY,header.height,window.screen.height,scroll.ri,rowHeights,cellHeight + strokeWidth);
            setResizeVerPos(outOfCanvasY + posOffset + posSize);
            setResizeHorPos(0);
            setResizeShow("ver");
        } else {
            setResizeShow("")
        }
    }

    // todo drag back not work
    // todo row resize not impl
    const moveFn =  useCallback((e) => {
        console.log(e.clientX)
        setResizeHorPos(e.clientX);
    },[]);

    function horResizeDown(e) {
        const {
            cellWidth,
            columnHeaderHeight,
            rowHeaderWidth,
            strokeWidth,
            colWidths,
            scroll,
        } = store.tableInfo;
        const header = {
            width: rowHeaderWidth + strokeWidth,
            height: columnHeaderHeight + strokeWidth,
        }
        const el=resizeHor.current;
        const {posIndex} =  transCords2CellIndexAndOffset(e.clientX,header.width,window.screen.width,scroll.ci,colWidths,cellWidth + strokeWidth);
        console.log(posIndex)
        setResizeBarPos({index: posIndex-1,pos: e.clientX});
        el.addEventListener('mousemove',moveFn);
    }

    function horResizeUp(e) {
        const el=resizeHor.current
        console.log(e.clientX);
        console.log(resizeBarPos.index,resizeBarPos.pos,e.clientX-resizeBarPos.pos);
        let cols = store.tableInfo.colWidths;
        cols[resizeBarPos.index] = !!!cols[resizeBarPos.index] ? store.tableInfo.cellWidth + e.clientX- resizeBarPos.pos :cols[resizeBarPos.index]+ e.clientX- resizeBarPos.pos;
        dispatch({
            type:"tableInfo",
            value: {...store.tableInfo, colWidths: cols}
        })
        setResizeBarPos({index: 0,pos: 0})
        el.removeEventListener('mousemove',moveFn);
    }

    function canvasClickUp(e) {
        const {
            cellHeight,
            cellWidth,
            columnHeaderHeight,
            rowHeaderWidth,
            strokeWidth,
            rowHeights,
            colWidths,
            scroll,
        } = store.tableInfo;
        const header = {
            width: rowHeaderWidth + strokeWidth,
            height: columnHeaderHeight + strokeWidth,
        }
        // header void
        e.clientY -= outOfCanvasY;
        if ((e.clientY < columnHeaderHeight && e.clientX > rowHeaderWidth) || (e.clientX < rowHeaderWidth && e.clientY > columnHeaderHeight)) {
            return;
        }
        const {posOffset:left,posSize:width} =  transCords2CellIndexAndOffset(e.clientX,header.width,window.screen.width,scroll.ci,colWidths,cellWidth + strokeWidth);
        const {posOffset:top,posSize:height} =  transCords2CellIndexAndOffset(e.clientY,header.height,window.screen.height,scroll.ri,rowHeights,cellHeight + strokeWidth);
        console.log({width,height,left,top})
        setSelector({width,height,left,top:top + outOfCanvasY});
    }

    return (
        <>
            <Canvas setCanvas={setCanvas} onMouseUp={canvasClickUp} onMouseMove={resizerHandler} width={document.documentElement.clientWidth} height={document.documentElement.clientHeight - 80} />
            <div ref={resizeHor} onMouseDown={horResizeDown} onMouseUp={horResizeUp} className={`w-2 hover:w-2.5 absolute bg-amber-200 cursor-col-resize`} style={{display:resizeShow ==="hor"?"block":"none",left:`${resizeHorPos}px`,top:`${resizeVerPos}px`,height:`${store.tableInfo.columnHeaderHeight}px`}}  />
            <div  className={`h-2 hover:h-2.5 absolute bg-amber-200 cursor-row-resize`} style={{display:resizeShow ==="ver"?"block":"none",left:`${resizeHorPos}px`,top:`${resizeVerPos}px`,width:`${store.tableInfo.rowHeaderWidth}px`}}  />
            <div className={`absolute border-2 border-indigo-200`} style={{width:selector.width,height:selector.height,left:selector.left,top:selector.top}} />
        </>

    );
}

export default Sheet;
