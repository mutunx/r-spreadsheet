import React from 'react';
import {useDispatch, useStore} from "../store/store";

function FormulaBar() {

    const store = useStore();
    const dispatch = useDispatch();

    function inputChange(e) {
        const value = e.target.value;
        const rows = store.tableInfo.rows;
        rows[store.editor.ri] = rows[store.editor.ri] ?? {cols: {}};
        rows[store.editor.ri].cols[store.editor.ci] = {text:value}
        dispatch({
            type: "tableInfo",
            value: {...store.tableInfo,rows},
        })

    }

    function getEditor() {
        const rows = store.tableInfo.rows;
        rows[store.editor.ri] = rows[store.editor.ri] ?? {cols: {}};
        const cell = rows[store.editor.ri].cols[store.editor.ci]
        return !!!cell ? '':cell.text;
    }

    return (
        <div className={"flex"}>
            <input className={"w-10 border border-black"}/>
            <div className={"border border-black"}>fx</div>
            <input defaultValue={getEditor()} key={`${Math.floor((Math.random() * 1000))}-min`} onChange={inputChange} className={"flex-grow border border-black"}/>
        </div>
    );
}

export default FormulaBar;
