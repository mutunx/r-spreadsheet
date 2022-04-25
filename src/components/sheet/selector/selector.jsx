import React, {useEffect, useState} from 'react';
import {useDispatch, useStore} from "../../store/store";
import {transCords2CellIndexAndOffset} from "../../../utils/tableInfoUtil";

function Selector(props) {
    const {client,offset} = props.mouseDownPos
    const outOfCanvasY = client.y - offset.y
    const store = useStore();
    const dispatch = useDispatch();
    const [selector, setSelector] = useState({width: 0, height: 0, left: 0, top: 0, display: "none", moving: false});
    const defaultEditor = {text: '', ri: 0, ci: 0, width: 0, height: 0, left: 0, top: 0, display: "none"};
    const [editor, setEditor] = useState(defaultEditor);

    useEffect(() => {
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
        if ((offset.y < columnHeaderHeight && offset.x > rowHeaderWidth) || (offset.x < rowHeaderWidth && offset.y > columnHeaderHeight)) {
            return;
        }
        const {
            posIndex: ci,
            posOffset: left,
            posSize: width
        } = transCords2CellIndexAndOffset(client.x, header.width, window.screen.width, scroll.ci, colWidths, cellWidth + strokeWidth);
        const {
            posIndex: ri,
            posOffset: top,
            posSize: height
        } = transCords2CellIndexAndOffset(client.y, header.height, window.screen.height, scroll.ri, rowHeights, cellHeight + strokeWidth);
        console.log({...selector, left, top: top + outOfCanvasY})
        setEditor({...editor, display: "none"})
        setSelector({top, display: "block", width, height, left, ci, ri, moving: true});
        console.log("down", selector)
        dispatch({
            type:"editor",
            value: {ri,ci},
        })
        // todo find a better way to mulit select
        // canvasRef.current.addEventListener('mousemove', selectorMouseMove(top + outOfCanvasY, left));
        // add new listen to deal move

    }, [offset])

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
        // canvasRef.current.removeEventListener("mousemove",selectorMouseMove(selector.top,selector.left));
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
            value: {...store.tableInfo, rows},
        })
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
        const {
            posOffset: left,
            posSize: width,
            posIndex: ci
        } = transCords2CellIndexAndOffset(e.clientX, header.width, window.screen.width, scroll.ci, colWidths, cellWidth + strokeWidth);
        const {
            posOffset: top,
            posSize: height,
            posIndex: ri
        } = transCords2CellIndexAndOffset(e.clientY, header.height, window.screen.height, scroll.ri, rowHeights, cellHeight + strokeWidth);
        let text = '';
        if (store.tableInfo.rows[ri] && store.tableInfo.rows[ri].cols && store.tableInfo.rows[ri].cols[ci]) {
            text = store.tableInfo.rows[ri].cols[ci].text;
        }
        setSelector({...selector, display: "none"})
        setEditor({text, ri, ci, width, height, left, top: top + outOfCanvasY, display: "block"});
    }

    return (
        <>
            <div className={`absolute border-2 border-indigo-200`} onDoubleClick={selectorDoubleClickHandler} style={{
                width: selector.width,
                height: selector.height,
                left: selector.left,
                top: selector.top,
                display: selector.display
            }}/>
            {/*todo how it work > ref={input=> input && input.focus()} <*/}
            <input ref={input => input && input.focus()} onBlur={onEditorBlur}
                   key={`${Math.floor((Math.random() * 1000))}-min`} className={`absolute border-2 border-black`}
                   defaultValue={editor.text} style={{
                width: editor.width,
                height: editor.height,
                left: editor.left,
                top: editor.top,
                display: editor.display
            }}/>
        </>
    );
}

export default Selector;
