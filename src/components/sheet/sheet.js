import React, {useCallback, useEffect, useRef, useState} from 'react';
import Canvas from "../canvas/canvas";
import {canvasEvents,checkMouseInResizeBar} from "../../services/CanvasEvents";
import {useDispatch, useStore} from "../store/store";

function Sheet() {

    let canvas = null;
    const store = useStore();
    const dispatch = useDispatch();
    const [resizeHorPos,setResizeHorPos] = useState(0);
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
            const {posOffset} =  checkMouseInResizeBar(e.nativeEvent.offsetX,header.width,window.screen.width,scroll.ci,colWidths,cellWidth + strokeWidth);
            setResizeHorPos(posOffset);
            setResizeVerPos(outOfCanvasY);
            setResizeShow("hor");
        } else if (e && e.nativeEvent.offsetX < rowHeaderWidth && e.nativeEvent.offsetY > columnHeaderHeight){
            const {posOffset} =  checkMouseInResizeBar(e.nativeEvent.offsetY,header.height,window.screen.height,scroll.ri,rowHeights,cellHeight + strokeWidth);
            setResizeVerPos(outOfCanvasY + posOffset);
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
        const {posIndex} =  checkMouseInResizeBar(e.clientX,header.width,window.screen.width,scroll.ci,colWidths,cellWidth + strokeWidth);
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

    return (
        <>
            <Canvas setCanvas={setCanvas} onMouseMove={resizerHandler} width={document.documentElement.clientWidth} height={document.documentElement.clientHeight - 80} />
            <div ref={resizeHor} onMouseDown={horResizeDown} onMouseUp={horResizeUp} className={`w-2 hover:w-2.5 absolute bg-amber-200 cursor-col-resize`} style={{display:resizeShow ==="hor"?"block":"none",left:`${resizeHorPos}px`,top:`${resizeVerPos}px`,height:`${store.tableInfo.columnHeaderHeight}px`}}  />
            <div  className={`h-2 hover:h-2.5 absolute bg-amber-200 cursor-row-resize`} style={{display:resizeShow ==="ver"?"block":"none",left:`${resizeHorPos}px`,top:`${resizeVerPos}px`,width:`${store.tableInfo.rowHeaderWidth}px`}}  />
        </>

    );
}

export default Sheet;
