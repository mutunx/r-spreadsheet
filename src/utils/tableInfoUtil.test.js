const {cell,updateRows,getOffsetFromScroll,transCords2CellIndexAndOffset,pos2offset} = require('./tableInfoUtil');
const rows = {
    6: {
        cols: {
            2:{
                text: "welcome"
            },
            3:{
                text:"home"
            }
        }
    }
}
describe('cell', () => {
    test('get exist data', ()=> {
        const item = cell(rows,6,2);
        expect(item.text).toStrictEqual('welcome');
    })
    test('get null data', ()=> {
        const item = cell(rows,3,3);
        expect(item.text).toStrictEqual('');
    })
    test('rows null', ()=> {
        const item = cell(null,3,3);
        expect(item.text).toStrictEqual('');
    })
});

describe('updateRows', () => {
    const newData = {
        text: "hello",
        type: "bold",
    }
    test('update in exist data', ()=> {
        const newRows = updateRows(rows,6,2,newData);
        expect(newRows[6].cols[2].text).toStrictEqual('hello');
        expect(newRows[6].cols[2].type).toStrictEqual("bold");
    })
    test('update in null data', ()=> {
        const newRows = updateRows(rows,3,3,newData);
        expect(newRows[3].cols[3].text).toStrictEqual('hello');
        expect(newRows[3].cols[3].type).toStrictEqual("bold");
    })
    test('update in null', ()=> {
        const newRows = updateRows(null,3,3,newData);
        expect(newRows[3].cols[3].text).toStrictEqual('hello');
        expect(newRows[3].cols[3].type).toStrictEqual("bold");
    })
})

describe('getOffsetFromScroll', () => {
    const e = {
        deltaX: 100,
        deltaY: 100,
    }
    test('position number', ()=> {
        const r = {
            offsetColumnIndex:Math.round(e.deltaX / 31.25),
            offsetRowIndex:Math.round(e.deltaY / 125),
        }
        const {offsetRowIndex,offsetColumnIndex} = getOffsetFromScroll(e);
        expect(offsetRowIndex).toEqual(r.offsetRowIndex);
        expect(offsetColumnIndex).toEqual(r.offsetColumnIndex);
    })
    test('negative number', ()=> {
        let ne = {...e}
        ne.deltaX = -100;
        ne.deltaY = -100;
        const r = {
            offsetColumnIndex:Math.round(ne.deltaX / 31.25),
            offsetRowIndex:Math.round(ne.deltaY / 125),
        }
        const {offsetRowIndex,offsetColumnIndex} = getOffsetFromScroll(ne);
        expect(offsetRowIndex).toEqual(r.offsetRowIndex);
        expect(offsetColumnIndex).toEqual(r.offsetColumnIndex);
    })
    test('not number', ()=> {
        let ne = {...e}
        ne.deltaX = "abc";
        ne.deltaY = "hel";
        const {offsetRowIndex,offsetColumnIndex} = getOffsetFromScroll(ne);
        expect(offsetRowIndex).toEqual(0);
        expect(offsetColumnIndex).toEqual(0);
    })
})

describe('transCords2CellIndexAndOffset',()=> {
    test('no customList', () => {
        const info = {
            mousePoint: 50,
            range: [0,100],
            startIndex: 0,
            defaultSize: 10,
            customList: {}
        }
        const result = {
            posIndex :5,
            posOffset :50,
            posSize: 10,
        }
        expect(transCords2CellIndexAndOffset(info.mousePoint, info.range[0],info.range[1],info.startIndex,info.customList,info.defaultSize)).toStrictEqual(result);
    });
    test('add custom list test', () => {
        const info = {
            mousePoint: 45,
            range: [0,50],
            startIndex: 0,
            defaultSize: 10,
            customList: {
                3:20,
                2:0,
                4:20,
            }
        }
        const result = {
            posIndex :4,
            posOffset :40,
            posSize: 20,
        }
        expect(transCords2CellIndexAndOffset(info.mousePoint, info.range[0],info.range[1],info.startIndex,info.customList,info.defaultSize)).toStrictEqual(result);
    });
    test('change start index test', () => {
        const info = {
            mousePoint: 45,
            range: [0,50],
            startIndex: 10,
            defaultSize: 10,
            customList: {
                3:20,
                2:0,
                4:20,
            }
        }
        const result = {
            posIndex :14,
            posOffset :40,
            posSize: 10,
        }
        expect(transCords2CellIndexAndOffset(info.mousePoint, info.range[0],info.range[1],info.startIndex,info.customList,info.defaultSize)).toStrictEqual(result);
    });
})

describe('pos2offset',() => {
    test('no custom list',() => {
        const info = {
            targetPos:3,
            startPos:1,
            endPos:6,
            customList: {},
            defaultSize:10,
            stokeWidth:1,
        }
        const result = {
            offset:22,
            size:11,
        }
        expect(pos2offset(info.targetPos,info.startPos,info.endPos,info.customList,info.defaultSize,info.stokeWidth)).toEqual(result);
    })
})
