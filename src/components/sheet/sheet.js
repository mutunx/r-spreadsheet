import React, {useState} from 'react';
import Canvas from "../canvas/canvas";
import Resizer from "./resizer/resizer";
import Selector from "./selector/selector";

function Sheet() {

    const defaultPos = {client: {x: 0, y: 0}, offset: {x: 0, y: 0}}
    const [movePos, setMovePos] = useState(defaultPos)
    const [downPos, setDownPos] = useState(defaultPos)

    return (
        <>
            <Canvas setMouseDownPos={setDownPos} setMouseMovePos={setMovePos}
                    width={document.documentElement.clientWidth}
                    height={document.documentElement.clientHeight - 80}/>
            <Resizer mouseMovePos={movePos}/>
            <Selector mouseDownPos={downPos}/>
            {/* todo scrollbar*/}
        </>

    );
}

export default Sheet;
