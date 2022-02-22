import React from 'react';
import Canvas from "../canvas/canvas";

function Sheet(props) {
    return (
        <>
            <Canvas width={document.documentElement.clientWidth} height={document.documentElement.clientHeight - 80} />
            <div className={"w-full overflow-x-scroll"}/>
        </>

    );
}

export default Sheet;
