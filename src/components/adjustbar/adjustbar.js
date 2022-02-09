import React from 'react';

function AdjustBar(props) {
    return (
        <div >
            <label htmlFor={"columnCount"}>columnCount: </label>
            <input id={"columnCount"}/>
        </div>
    );
}

export default AdjustBar;
