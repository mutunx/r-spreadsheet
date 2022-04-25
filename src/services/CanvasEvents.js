import CanvasDraw from "./CanvasDraw"

const events = {
    "onresize": onresize,
}





function onresize(ctx, tableInfo) {
    return () => {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight - 80;
        CanvasDraw(ctx, "DrawTable", tableInfo);
    }
}



export function canvasEvents(ctx, event, ...props) {
    if (!Object.keys(events).includes(event)) console.error("invalid event in drawEvent")
    return events[event](ctx, ...props);
}

// todo find a way to get the screen max display ri and ci , and need know the size and offset
