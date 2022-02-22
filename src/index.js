import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Canvas from './components/canvas/canvas';
import reportWebVitals from './reportWebVitals';
import {StoreProvider} from "./components/store/store";
import AdjustBar from "./components/adjustbar/adjustbar";
import Sheet from "./components/sheet/sheet";

ReactDOM.render(
    <React.StrictMode>
        <StoreProvider>
            <div className={"h-screen w-screen"}>
                <AdjustBar />
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
