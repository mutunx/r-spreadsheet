import React from 'react';
import Input from "./input/input";
import {useDispatch, useStore} from "../store/store";

function AdjustBar() {
    const store = useStore();
    const dispatch = useDispatch();

    function valueChange(key) {

        return (evt) => {
            dispatch({
                type: "tableInfo",
                value: {...store.tableInfo, [key]: evt.target.value * 1}
            })
        }
    }

    return (

        <form className={"flex"}>
            {Object.keys(store.tableInfo)
                .filter(key => typeof store.tableInfo[key] == "number")
                .map(key => {
                    return (<Input onBlur={valueChange(key)} key={key} min={1} value={store.tableInfo[key]} id={key}/>)
                })}
        </form>
    );
}

export default AdjustBar;
