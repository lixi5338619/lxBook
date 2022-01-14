/*
* 将 var a; 转换为 var a = 123 + 456;
*
* */

const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "var a";

let ast = parse(jscode);

const visitor =
    {
        // 方法一
        VariableDeclarator(path){
            const {init} = path.node;
            let node = {
                type: "BinaryExpression",
                operator: "+",
                left: {
                    type: "NumericLiteral",
                    value: 123,
                },
                right: {
                    type: "NumericLiteral",
                    value: 456,
                }
            }

            init || path.set("init", node)
        },

        // 方法二
/*        VariableDeclarator(path){
            const {init} = path.node;
            init || path.set("init", t.binaryExpression('+',t.valueToNode(123),t.valueToNode(456)))

        },*/
    }



//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);

