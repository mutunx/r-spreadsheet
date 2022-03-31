import React, {useEffect, useRef} from 'react';
import {useDispatch, useStore} from "../store/store";
import {canvasEvents} from "../../services/CanvasEvents";
import canvasDraw from "../../services/CanvasDraw";

function  Canvas(props) {

    const {setCanvas,...rest} = props
    const canvasRef = props.canvasref
    const dispatch = useDispatch();
    const store = useStore();

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d');
        canvasDraw(ctx, "DrawTable", store.tableInfo);
        canvas.onmousemove = canvasEvents(ctx, "onmousemove", store.tableInfo);
        canvas.onwheel = canvasEvents(ctx,"onwheel", store.tableInfo,dispatch);
        window.onresize = canvasEvents(ctx, "onresize", store.tableInfo)
        setCanvas(canvasRef);
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

    return (
        <canvas ref={canvasRef} {...rest} />
    );
}

export default Canvas;
