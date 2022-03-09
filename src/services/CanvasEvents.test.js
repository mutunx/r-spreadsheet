const {checkMouseInResizeBar} = require('./CanvasEvents');

test('base test', () => {
    const customList = {
        3:0,
    }
    const result = {
        posIndex :6,
        posOffset :60,
    }
     expect(checkMouseInResizeBar(50, 0,100,0,customList,10)).toStrictEqual(result);
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
     expect(checkMouseInResizeBar(400, 0,500,0,customList,100)).toStrictEqual(result);
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
    expect(checkMouseInResizeBar(400, 0,500,10,customList,101)).toStrictEqual(result);
});
