const {cell,updateRows} = require('./tableInfoUtil');
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
});

describe('updateRows', () => {
    const newData = {
        text: "hello",
        type: "bold",
    }
    test('update in exist data', ()=> {
        const newRows = updateCell(rows,6,2,newData);
        expect(newRows[6].cols[2].text).toStrictEqual('hello');
        expect(newRows[6].cols[2].type).toStrictEqual("bold");
    })
    test('update in null data', ()=> {
        const newRows = updateCell(rows,3,3,newData);
        expect(newRows[3].cols[3].text).toStrictEqual('hello');
        expect(newRows[3].cols[3].type).toStrictEqual("bold");
    })
})
