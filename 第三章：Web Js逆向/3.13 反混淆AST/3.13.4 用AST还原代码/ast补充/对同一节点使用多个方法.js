
const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "";

let ast = parse(jscode);

const visitor =
    {
        CallExpression:
            {// 注意顺序
                enter: [reduce_call_express, delete_empty_params]
            },
    }


//some function code

function reduce_call_express(path) {
}

function delete_empty_params(path) {
}

traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);

/*

假设想对一个函数表达式的 CallExpression 节点进行进行实参还原，
如果还原后，没有了实参和形参，假如又可以将函数体里面的代码提取出来。
这个时候就需要两个方法来分别进行处理了

reduce_call_express     还原函数的实参
delete_empty_params     将参数为空的函数进行处理，将函数体里面的代码直接提取出来

*/