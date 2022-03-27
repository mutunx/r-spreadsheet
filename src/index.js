import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {StoreProvider} from "./components/store/store";
import Sheet from "./components/sheet/sheet";
import FormulaBar from "./components/formularbar/formulabar";
import ToolBar from "./components/toolbar/toolbar";

ReactDOM.render(
    <React.StrictMode>
        <StoreProvider>
            <div className={"h-screen w-screen"}>
                <ToolBar />
                <FormulaBar />
                <Sheet/>
            </div>
        </StoreProvider>
    </React.StrictMode>,
    document.getElementById('root')
)
;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
