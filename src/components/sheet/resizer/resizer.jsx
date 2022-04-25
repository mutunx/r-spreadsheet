import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useStore} from "../../store/store";
import {transCords2CellIndexAndOffset} from "../../../utils/tableInfoUtil";

function Resizer(props) {
    const {client,offset} = props.mouseMovePos;
    const outOfCanvasY = client.y - offset.y;
    const resizeHor = useRef(null);
    const store = useStore();
    const dispatch = useDispatch();
    const [resizeShow,setResizeShow] = useState("");
    const [resizeHorPos,setResizeHorPos] = useState(0);
    const [resizeVerPos,setResizeVerPos] = useState(0);
    const [resizeBarPos,setResizeBarPos] = useState({index:0,pos:0})
    // todo drag back not work
    // todo row resize not impl
    const moveFn =  useCallback((e) => {
        console.log(e.clientX)
        setResizeHorPos(e.clientX);
    },[]);
    useEffect(() =>{
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
        if (offset.y < columnHeaderHeight && offset.x > rowHeaderWidth) {
            const {posOffset,posSize} =  transCords2CellIndexAndOffset(offset.x,header.width,window.screen.width,scroll.ci,colWidths,cellWidth + strokeWidth);
            setResizeHorPos(posOffset+posSize);
            setResizeVerPos(outOfCanvasY);
            setResizeShow("hor");
        } else if (offset.x < rowHeaderWidth && offset.y > columnHeaderHeight){
            const {posOffset,posSize} =  transCords2CellIndexAndOffset(offset.y,header.height,window.screen.height,scroll.ri,rowHeights,cellHeight + strokeWidth);
            setResizeVerPos(outOfCanvasY + posOffset + posSize);
            setResizeHorPos(0);
            setResizeShow("ver");
        } else {
            setResizeShow("")
        }
    },[offset])
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
    return (
        <>
            <div ref={resizeHor} onMouseDown={horResizeDown}  onMouseUp={horResizeUp} className={`w-2 hover:w-2.5 absolute bg-amber-200 cursor-col-resize`} style={{display:resizeShow ==="hor"?"block":"none",left:`${resizeHorPos}px`,top:`${resizeVerPos}px`,height:`${store.tableInfo.columnHeaderHeight}px`}}  />
            <div className={`h-2 hover:h-2.5 absolute bg-amber-200 cursor-row-resize`} style={{display:resizeShow ==="ver"?"block":"none",left:`${resizeHorPos}px`,top:`${resizeVerPos}px`,width:`${store.tableInfo.rowHeaderWidth}px`}}  />
        </>
    );
}

export default Resizer;
