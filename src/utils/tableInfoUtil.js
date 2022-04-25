const newDataObject = {
    text:'',
    type:'',
}
const newColumns = {
    cols:{}
}

/**
 * get cell from rows
 * @param rows - data sources
 * @param ri - data's ri
 * @param ci - data's ci
 * @returns {{text: string, type: string}}
 */
export function cell(rows,ri,ci) {
    if (!!!rows) return newDataObject;
    return !!!rows?.[ri]?.cols?.[ci] ? newDataObject : rows[ri].cols[ci];
}

/**
 * update rows
 * @param rows - rows which need to be updating
 * @param ri - updating cell's ri
 * @param ci - updating cell's ci
 * @param data - updating cell's data
 * @returns {{rows}} - rows which updated data
 */
export function updateRows(rows,ri,ci,data) {
    rows = rows ?? {[ri]:newColumns};
    rows[ri] = rows[ri] ?? newColumns;
    rows[ri].cols[ci] = data;
    return rows;
}

/**
 * get cell index offset from mouseEvent
 * @param e - mouseEvent
 * @returns {{offsetRowIndex: number, offsetColumnIndex: number}} -{offsetRi,offsetCi}
 */
export function getOffsetFromScroll(e){
    let {deltaX,deltaY} = e;
    deltaY = isNaN(deltaY) ? 0:deltaY;
    deltaX = isNaN(deltaX) ? 0:deltaX;
    let offsetRowIndex = 0, offsetColumnIndex = 0;
    if (deltaX !== 0) offsetColumnIndex = Math.round(deltaX / 31.25);
    if (deltaY !== 0) offsetRowIndex = Math.round(deltaY / 125);
    return {offsetRowIndex,offsetColumnIndex}
}

/**
 * get the cell info which contain mousePoint base on x,y
 * @param mousePoint - point which to be calculated
 * @param startPoint - range point size
 * @param endPoint - range point size
 * @param startIndex - init index
 * @param customList - list contains custom index's size
 * @param defaultSize - index default size
 * @returns {{posIndex: number, posSize, posOffset: number}} - posIndex - the index cell which contain mousePoint  posOffset - the offset of cell which contain mousePoint
 */
export function transCords2CellIndexAndOffset(mousePoint, startPoint, endPoint, startIndex, customList, defaultSize) {
    let currentPoint = startPoint;
    let currentSize = defaultSize;
    for (; currentPoint < endPoint; startIndex++) {
        if (currentPoint > mousePoint) break;
        currentSize = customList[startIndex] ?? defaultSize;
        currentPoint += currentSize;
    }
    return {posIndex:startIndex-1,posOffset:currentPoint-currentSize,posSize: currentSize};
}

/**
 * get the cell info which contain mousePoint base on ri,ci
 * @param targetPos - target index
 * @param startPos - start index
 * @param endPos - end index
 * @param customList - list contains custom index's size
 * @param defaultSize - index default size
 * @param stokeWidth - border width
 * @returns {{offset: number, size: number}} -offset - cell; -index - size - cell size
 */
export function pos2offset(targetPos,startPos,endPos,customList,defaultSize,stokeWidth) {
    let offset = 0;
    let size = 0;
    if (targetPos < startPos || targetPos > endPos) return {offset:-1,size:-1};
    for(; startPos <= targetPos; startPos++) {
        size = customList[startPos] ?? defaultSize;
        size += stokeWidth;
        if (startPos !== targetPos) offset += size;
    }
    return {offset,size};
}
