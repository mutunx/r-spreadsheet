const {transCords2CellIndexAndOffset} = require('./CanvasEvents');

test('base test', () => {
    const customList = {
        3:0,
    }
    const result = {
        posIndex :6,
        posOffset :60,
    }
     expect(transCords2CellIndexAndOffset(50, 0,100,0,customList,10)).toStrictEqual(result);
});
test('multi custom list test', () => {
    const customList = {
        3:200,
        2:0,
        4:200,
    }
    const result = {
        posIndex :4,
        posOffset :600,
    }
     expect(transCords2CellIndexAndOffset(400, 0,500,0,customList,100)).toStrictEqual(result);
});

test('start index change test', () => {
    const customList = {
        3:200,
        2:0,
        4:200,
    }
    const result = {
        posIndex :13,
        posOffset :404,
    }
    expect(transCords2CellIndexAndOffset(400, 0,500,10,customList,101)).toStrictEqual(result);
});
