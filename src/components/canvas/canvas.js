import React, {useEffect, useRef} from 'react';
import {useDispatch, useStore} from "../store/store";
import {canvasEvents} from "../../services/CanvasEvents";
import canvasDraw from "../../services/CanvasDraw";

function  Canvas(props) {

    const {setMouseDownPos,setMouseMovePos,...rest} = props
    const canvasRef = useRef(null)
    const dispatch = useDispatch();
    const store = useStore();
    useEffect(() => {
        canvasRef.current.onwheel = canvasEvents(canvasRef.current.getContext("2d"), "onwheel", store.tableInfo, dispatch);
    }, [canvasRef])
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d');
        canvasDraw(ctx, "DrawTable", store.tableInfo);
        canvas.onmousemove = canvasEvents(ctx, "onmousemove", store.tableInfo);
        canvas.onwheel = canvasEvents(ctx,"onwheel", store.tableInfo,dispatch);
        window.onresize = canvasEvents(ctx, "onresize", store.tableInfo)
        // setCanvas(canvasRef);
    }, [store.tableInfo])

    useEffect(() => {
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
        if (!!!e.nativeEvent) return;
        setMouseMovePos(getPos(e));
    }

    function onDown(e) {
        if (!!!e.nativeEvent) return;
        setMouseDownPos(getPos(e));
    }

    return (
        <canvas ref={canvasRef} onMouseMove={onMove} onMouseDown={onDown} {...rest} />
    );
}

export default Canvas;
