import CanvasDraw from "./CanvasDraw"

const events = {
    "onmousemove": onmousemove,
    "onresize": onresize,
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
