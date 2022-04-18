import React, {useState} from 'react';
import {useDispatch, useStore} from "../../store/store";
import {cell, updateCell, updateRows} from "../../../utils/tableInfoUtil";

function ToolButton(props) {

    const [state,setState] = useState({active:""});
    const store = useStore();
    const dispatch = useDispatch();

    function itemClick(e) {
        let rows = {...store.tableInfo.rows};
        const newItem = cell(rows,store.editor.ri,store.editor.ci);
        newItem.type = 'bold'
        const newRows = updateRows(rows,store.editor.ri,store.editor.ci,newItem)
        dispatch({
            type:"tableInfo",
            value: {...store.tableInfo, rows: newRows}
        });
    }
    function btnOnClick(e) {
        const itemList = {
            left:24 * (props.index-1),
            top:24,
            width:100,
            height:100
        }
        if (state.active === '') {
            props.setItemList({...itemList,display:"block",items:[<button onClick={itemClick}>bold</button>,<div>hi</div>,<div>world</div>]})
        } else {
            props.setItemList({...itemList,display:"none",items:[]})
        }
        setState({...state,active: state.active === '' ? 'active':''})
    }

    return (
        <div className={`hover:bg-gray-300 active:bg-gray-400 ${state.active === 'active' ? 'bg-gray-400':''}`}  onClick={btnOnClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
    );
}

export default ToolButton;
