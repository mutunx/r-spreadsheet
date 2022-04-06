import React, {useCallback, useEffect, useRef, useState} from 'react';
import Canvas from "../canvas/canvas";
import {canvasEvents,transCords2CellIndexAndOffset} from "../../services/CanvasEvents";
import {useDispatch, useStore} from "../store/store";
import Resizer from "./resizer/resizer";
import Selector from "./selector/selector";

function Sheet() {

    let canvas = null;
    const store = useStore();
    const dispatch = useDispatch();
    const [outOfCanvasY,setOutOfCanvasY] = useState(0);
    const [movePos,setMovePos] = useState({x:0,y:0})
    const [clickPos,setClickPos] = useState({x:0,y:0})
    const canvasRef = useRef(null);
    useEffect(()=>{
        canvas.current.onwheel = canvasEvents(canvas.current.getContext("2d"),"onwheel", store.tableInfo,dispatch);
    }, [canvas])

    function setCanvas(canvasRef) {
        canvas = canvasRef;
        setOutOfCanvasY(canvas.current.offsetTop);

    }



    function canvasMouseDown(e) {
        setClickPos({x:e.clientX,y:e.clientY})
    }


    function canvasMouseUp(e) {

    }


    function canvasMove(e) {
        if (e.nativeEvent) {
            setMovePos({x:e.nativeEvent.offsetX,y:e.nativeEvent.offsetY});
        }
    }

    return (
        <>
            <Canvas canvasref={canvasRef} setCanvas={setCanvas} onMouseDown={canvasMouseDown} onMouseUp={canvasMouseUp} onMouseMove={canvasMove} width={document.documentElement.clientWidth} height={document.documentElement.clientHeight - 80} />
            <Resizer movePos={movePos} outOfCanvasY={outOfCanvasY} />
            <Selector x={clickPos.x} y={clickPos.y} outOfCanvasY={outOfCanvasY} />
        </>

    );
}

export default Sheet;
