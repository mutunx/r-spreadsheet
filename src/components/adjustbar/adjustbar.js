import React from 'react';
import Input from "./input/input";
import {useDispatch, useStore} from "../store/store";

function AdjustBar() {
    const store = useStore();
    const dispatch = useDispatch();
    function valueChange(key) {

        return (evt) => {
            // console.log(key,evt.target.value);
            dispatch({
                type:"tableInfo",
                value: {...store.tableInfo,[key]:evt.target.value*1}
            })
        }
    }
    return (

        <form className={"flex"}>
            {Object.keys(store.tableInfo).map(key=>{
                return (<Input  onBlur={valueChange(key)} key={key} value={store.tableInfo[key]} id={key}  />)
            })}
        </form>
    );
}

export default AdjustBar;
