import React, {useCallback, useEffect, useRef, useState} from 'react';
import Canvas from "../canvas/canvas";
import {canvasEvents,transCords2CellIndexAndOffset} from "../../services/CanvasEvents";
import {useDispatch, useStore} from "../store/store";

function Sheet() {

    let canvas = null;
    const defaultEditor = {text:'',ri:0,ci:0,width:0,height:0,left:0,top:0,display:"none"};
    const store = useStore();
    const dispatch = useDispatch();
    const [resizeHorPos,setResizeHorPos] = useState(0);
    const [selector,setSelector] = useState({width:0,height:0,left:0,top:0,display:"none",moving:false});
    const [editor,setEditor] = useState(defaultEditor);
    const [outOfCanvasY,setOutOfCanvasY] = useState(0);
    const [resizeVerPos,setResizeVerPos] = useState(0);
    const [resizeShow,setResizeShow] = useState("");
    const [resizeBarPos,setResizeBarPos] = useState({index:0,pos:0})
    const resizeHor = useRef(null);
    const canvasRef = useRef(null);
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

    function canvasMouseDown(e) {
        // recode start position
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
        const clientY = e.clientY - outOfCanvasY;
        if ((clientY < columnHeaderHeight && e.clientX > rowHeaderWidth) || (e.clientX < rowHeaderWidth && clientY > columnHeaderHeight)) {
            return;
        }
        const {posIndex:ci,posOffset:left,posSize:width} =  transCords2CellIndexAndOffset(e.clientX,header.width,window.screen.width,scroll.ci,colWidths,cellWidth + strokeWidth);
        const {posIndex:ri,posOffset:top,posSize:height} =  transCords2CellIndexAndOffset(e.clientY,header.height,window.screen.height,scroll.ri,rowHeights,cellHeight + strokeWidth);
        console.log({...selector,left,top:top + outOfCanvasY})
        setEditor({...editor,display: "none"})
        setSelector({top:top + outOfCanvasY,display: "block",width: 0,height: 0,left,ci,ri,moving:true});
        console.log("down",selector)
        canvasRef.current.addEventListener('mousemove',selectorMouseMove(top + outOfCanvasY,left));
        // add new listen to deal move

    }

    function selectorMouseMove(startTop,startLeft) {
        return (e) => {
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
            const clientY = e.clientY - outOfCanvasY;
            if ((clientY < columnHeaderHeight && e.clientX > rowHeaderWidth) || (e.clientX < rowHeaderWidth && clientY > columnHeaderHeight)) {
                return;
            }
            const {posIndex:ci,posOffset:left,posSize:width} =  transCords2CellIndexAndOffset(e.clientX,header.width,window.screen.width,scroll.ci,colWidths,cellWidth + strokeWidth);
            const {posIndex:ri,posOffset:top,posSize:height} =  transCords2CellIndexAndOffset(clientY,header.height,window.screen.height,scroll.ri,rowHeights,cellHeight + strokeWidth);
            // console.log({width:e.clientX-left,height:clientY-top,left,top:top + outOfCanvasY,display: "block"})

            console.log({width:e.clientX-selector.left,height:clientY-selector.top},selector)
            console.log({...selector})
            setSelector({top:startTop,left:startLeft, width:e.clientX-selector.left,height:clientY-selector.top,ri,ci,display: "block",moving: true})
            console.log("move",selector)
        }

    }

    function canvasMouseUp(e) {
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
        const clientY = e.clientY - outOfCanvasY;
        if ((clientY < columnHeaderHeight && e.clientX > rowHeaderWidth) || (e.clientX < rowHeaderWidth && clientY > columnHeaderHeight)) {
            return;
        }
        const {posIndex:ci,posOffset:left,posSize:width} =  transCords2CellIndexAndOffset(e.clientX,header.width,window.screen.width,scroll.ci,colWidths,cellWidth + strokeWidth);
        const {posIndex:ri,posOffset:top,posSize:height} =  transCords2CellIndexAndOffset(clientY,header.height,window.screen.height,scroll.ri,rowHeights,cellHeight + strokeWidth);
        setSelector({...selector,moving: false});
        dispatch({
            type:"editor",
            value: {ri,ci},
        })
        canvasRef.current.removeEventListener("mousemove",selectorMouseMove(selector.top,selector.left));
    }

    function selectorDoubleClickHandler(e) {
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
        const {posOffset:left,posSize:width,posIndex:ci} =  transCords2CellIndexAndOffset(e.clientX,header.width,window.screen.width,scroll.ci,colWidths,cellWidth + strokeWidth);
        const {posOffset:top,posSize:height,posIndex:ri} =  transCords2CellIndexAndOffset(e.clientY,header.height,window.screen.height,scroll.ri,rowHeights,cellHeight + strokeWidth);
        let text = '';
        if (store.tableInfo.rows[ri] && store.tableInfo.rows[ri].cols && store.tableInfo.rows[ri].cols[ci]) {
            text = store.tableInfo.rows[ri].cols[ci].text;
        }
        setSelector({...selector,display: "none"})
        setEditor({text,ri,ci,width,height,left,top:top + outOfCanvasY,display: "block"});
    }

    function onEditorBlur(e) {
        console.log("blur")
        //get value
        const text = e.target.value;
        // update store
        const rows = store.tableInfo.rows;
        rows[editor.ri] = rows[editor.ri] ?? {cols: {}};
        rows[editor.ri].cols[editor.ci] = {text}
        dispatch({
            type: "tableInfo",
            value: {...store.tableInfo,rows},
        })
    }

    return (
        <>
            <Canvas canvasref={canvasRef} setCanvas={setCanvas} onMouseDown={canvasMouseDown} onMouseUp={canvasMouseUp} onMouseMove={resizerHandler} width={document.documentElement.clientWidth} height={document.documentElement.clientHeight - 80} />
            <div ref={resizeHor} onMouseDown={horResizeDown}  onMouseUp={horResizeUp} className={`w-2 hover:w-2.5 absolute bg-amber-200 cursor-col-resize`} style={{display:resizeShow ==="hor"?"block":"none",left:`${resizeHorPos}px`,top:`${resizeVerPos}px`,height:`${store.tableInfo.columnHeaderHeight}px`}}  />
            <div className={`h-2 hover:h-2.5 absolute bg-amber-200 cursor-row-resize`} style={{display:resizeShow ==="ver"?"block":"none",left:`${resizeHorPos}px`,top:`${resizeVerPos}px`,width:`${store.tableInfo.rowHeaderWidth}px`}}  />
            <div className={`absolute border-2 border-indigo-200`} onDoubleClick={selectorDoubleClickHandler} style={{width:selector.width,height:selector.height,left:selector.left,top:selector.top,display:selector.display}} />
             {/*todo how it work > ref={input=> input && input.focus()} <*/}
            <input ref={input=> input && input.focus()} onBlur={onEditorBlur} key={`${Math.floor((Math.random() * 1000))}-min`} className={`absolute border-2 border-black`} defaultValue={editor.text}  style={{width:editor.width,height:editor.height,left:editor.left,top:editor.top,display:editor.display}} />
        </>

    );
}

export default Sheet;
