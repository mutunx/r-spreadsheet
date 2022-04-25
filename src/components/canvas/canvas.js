import React, {useEffect, useRef} from 'react';
import {useDispatch, useStore} from "../store/store";
import {canvasEvents} from "../../services/CanvasEvents";
import canvasDraw from "../../services/CanvasDraw";
import {getOffsetFromScroll} from "../../utils/tableInfoUtil";
import CanvasDraw from "../../services/CanvasDraw";

function  Canvas(props) {

    const {setMouseDownPos,setMouseMovePos,...rest} = props
    const canvasRef = useRef(null)
    const dispatch = useDispatch();
    const store = useStore();
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d');
        canvasDraw(ctx, "DrawTable", store.tableInfo);
        window.onresize = canvasEvents(ctx, "onresize", store.tableInfo)
    }, [store.tableInfo])

    useEffect(() => {
        // toolbar event trigger
        if (!!!store.drawEvent) return;
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d');
        canvasDraw(ctx, store.drawEvent.event, ...store.drawEvent.props);
        dispatch({
            type: "drawEvent",
            value: null,
        })
    }, [store.drawEvent])


    function getPos(e) {
        return {
            client: {
                x:e.nativeEvent.clientX,
                y:e.nativeEvent.clientY,
            },
            offset: {
                x:e.nativeEvent.offsetX,
                y:e.nativeEvent.offsetY,
            }
        }
    }

    function onMove(e) {
        const {tableInfo} = store;
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d');
        if (!!!e.nativeEvent) return;
        setMouseMovePos(getPos(e));
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        CanvasDraw(ctx, "DrawTable", tableInfo, e);
    }

    function onDown(e) {
        if (!!!e.nativeEvent) return;
        setMouseDownPos(getPos(e));
    }

    function onScroll(e) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d');
        const {tableInfo} = store;
        const {offsetRowIndex,offsetColumnIndex} = getOffsetFromScroll(e);
        let newRowIndex = tableInfo.scroll.ri + offsetRowIndex;
        let newColIndex = tableInfo.scroll.ci + offsetColumnIndex;
        const scroll = {
            ri: newRowIndex < 0 ? 0 : newRowIndex,
            ci: newColIndex < 0 ? 0 : newColIndex,
        }
        dispatch({
            type: "tableInfo",
            value: {...tableInfo, scroll}
        })
        CanvasDraw(ctx, "DrawTable", tableInfo);
    }

    return (
        <canvas ref={canvasRef}
                onMouseMove={onMove}
                onMouseDown={onDown}
                onScroll={onScroll}
                {...rest} />
    );
}

export default Canvas;
