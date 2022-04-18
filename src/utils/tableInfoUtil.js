const newDataObject = {
    text:'',
    type:'',
}
const newColumns = {
    cols:{}
}

export function cell(rows,ri,ci) {
    if (!!!rows || !!!rows[ri] || !!!rows[ri].cols || !!!rows[ri].cols[ci]) return newDataObject;
    return rows[ri].cols[ci];
}

export function updateRows(rows,ri,ci,data) {
    rows = rows ?? {[ri]:newColumns};
    rows[ri] = rows[ri] ?? newColumns;
    rows[ri].cols[ci] = data;
    return rows;

}
