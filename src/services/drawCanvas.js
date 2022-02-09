import {useStore} from "../components/store/store";

const drawEvents = (context) => {
    return {
        "Text": (text) => {
            console.log(text);
            context.fillText(text, 100, 100);
            context.stroke();
        }
    }
}

export function DrawCanvas(event,...args) {
    const store = useStore();
    const drawEventWithCtx = drawEvents(store.canvasCtx);
    if (Object.keys(drawEventWithCtx).includes(event)) {
        return drawEventWithCtx[event](...args);
    } else {
        console.error("invalid event in drawEvent")
    }
}
