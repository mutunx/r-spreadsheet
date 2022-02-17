import React, {createContext, useContext, useReducer} from 'react';

const DispatchContext = createContext(null);
const StateContext = createContext(null);
const defaultTableInfo = {
    rowCount:23,
    columnCount: 17,
    cellHeight: 25,
    cellWidth: 80,
    columnHeaderHeight: 30,
    rowHeaderWidth: 50,
    strokeWidth: 0.6,
    baseColor: "#f3f4f6",
    hoverColor: "#e5e7eb",
    lineColor: "#d1d5db"
}
const initialState = {fileName: "new_file", canvasCtx: null, tableInfo: defaultTableInfo}

function handler(state, action) {
    switch (action.type) {
        case "fileName":
            return {...state, fileName: action.value}
        case "canvasCtx":
            return {...state, canvasCtx:action.value}
        case "tableInfo":
            return {...state, tableInfo: action.value}
        default:
            throw new Error();
    }
}

function useStore() {
    return useContext(StateContext);
}
function useDispatch() {
    return useContext(DispatchContext);
}

function StoreProvider(props) {

    const [state, dispatch] = useReducer(handler, initialState);
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {props.children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}

export {StoreProvider, useStore, useDispatch};
