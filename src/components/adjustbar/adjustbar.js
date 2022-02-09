import React from 'react';
import Input from "./input/input";
import {useStore} from "../store/store";

function AdjustBar() {
    const store = useStore();

    return (

        <form className={"flex"}>
            <Input value={store.tableInfo.rowCount} id={"rowCount"} label={"rowCount"}/>
            <Input value={store.tableInfo.columnCount} id={"columnCount"} label={"columnCount"}/>
            <Input value={store.tableInfo.cellHeight} id={"cellHeight"} label={"cellHeight"}/>
            <Input value={store.tableInfo.cellWidth} id={"cellWidth"} label={"cellWidth"}/>
            <Input value={store.tableInfo.rowHeaderWidth} id={"rowHeaderWidth"} label={"rowHeaderWidth"}/>
            <Input value={store.tableInfo.rowHeaderHeight} id={"rowHeaderHeight"} label={"rowHeaderHeight"}/>
            <Input value={store.tableInfo.columnHeaderWidth} id={"columnHeaderWidth"} label={"columnHeaderWidth"}/>
            <Input value={store.tableInfo.columnHeaderHeight} id={"columnHeaderHeight"} label={"columnHeaderHeight"}/>
            
        </form>
    );
}

export default AdjustBar;
