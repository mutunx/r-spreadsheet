import React, {createContext, useContext, useReducer} from 'react';

const DispatchContext = createContext(()=>{});
const StateContext = createContext(()=>{});
const defaultTableInfo = {
    rowCount: 23,
    columnCount: 17,
    cellHeight: 25,
    cellWidth: 80,
    columnHeaderHeight: 30,
    rowHeaderWidth: 50,
    strokeWidth: 0.6,
    baseColor: "#f3f4f6",
    hoverColor: "#e5e7eb",
    lineColor: "#d1d5db",
    rows: {
        0:{
            cols:{
                0:{
                    text:"hello"
                },
                1:{
                    text:"world"
                }
            }
        },
        6: {
            cols: {
                2:{
                    text: "welcome"
                },
                3:{
                    text:"home"
                }
            }
        }
    },
    rowHeights:{
        2:40,
    },
    colWidths:{
        2:40,
    },
    scroll:{
        ri:0,
        ci:0,
    }
}
const initialState = {fileName: "new_file", tableInfo: defaultTableInfo, drawEvent: null,editor: {ri:-1,ci:-1},}

function handler(state, action) {
    switch (action.type) {
        case "fileName":
            return {...state, fileName: action.value}
        case "drawEvent":
            return {...state, drawEvent: action.value}
        case "tableInfo":
            return {...state, tableInfo: action.value}
        case "editor":
            return {...state, editor: action.value}
        default:
            throw new Error("no such type");
    }
}

function useStore() {
    return useContext(StateContext);
}

function useDispatch() {
    return useContext(DispatchContext);
}

function StoreProvider(props) {

    const [state, dispatch] = useReducer(handler, initialState,()=>{});
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {props.children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}

export {StoreProvider, useStore, useDispatch};
