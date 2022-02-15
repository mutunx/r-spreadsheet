import React, {createContext, useContext, useReducer} from 'react';

const DispatchContext = createContext(null);
const StateContext = createContext(null);
const defaultTableInfo = {
    rowCount:100,
    columnCount: 30,
    cellHeight: 25,
    cellWidth: 100,
    columnHeaderHeight: 30,
    rowHeaderWidth: 50,
    strokeWidth: 1,
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
