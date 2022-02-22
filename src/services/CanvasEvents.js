import CanvasDraw from "./CanvasDraw"
import canvasDraw from "./CanvasDraw";

const events = {
    "onmousemove": onmousemove,
    "onresize": onresize,
    "onwheel": onwheel
}

function onwheel(ctx,tableInfo,dispatch) {
    return (e) => {
        const {deltaX,deltaY} = e;
        let sri = 0, sci = 0;
        if (deltaX !== 0) sci = Math.round(deltaX / 31.25);
        if (deltaY !== 0) sri = Math.round(deltaY / 125);
        sri += tableInfo.scroll.ri;
        sci += tableInfo.scroll.ci;
        const scroll = {
            ri: sri < 0 ? 0 : sri,
            ci: sci < 0 ? 0 : sci,
        }
        dispatch({
            type: "tableInfo",
            value: {...tableInfo, scroll}
        })
        CanvasDraw(ctx, "DrawTable", tableInfo);
    }
}

function onmousemove(ctx, tableInfo) {
    return (e) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        CanvasDraw(ctx, "DrawTable", tableInfo, e);
    }
}

function onresize(ctx, tableInfo) {
    return (e) => {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight - 80;
        CanvasDraw(ctx, "DrawTable", tableInfo);
    }
}

const CanvasEvents = (ctx, event, ...props) => {
    if (!Object.keys(events).includes(event)) console.error("invalid event in drawEvent")
    return events[event](ctx, ...props);
}

export default CanvasEvents;
