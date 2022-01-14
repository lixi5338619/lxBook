/*
*/

const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "var s = \"\u4f60\u597d\uff0c\u4e16\u754c;\"\n" +
    "var a = \"\u0068\u0065\u006c\u006c\u006f\u002c\u0020\u0077\u006f\u0072\u0064\";";

let ast = parse(jscode);

const visitor =
    {
        StringLiteral(path)
        {
            path.get('extra').remove();
        },
    }

//some function code


traverse(ast,visitor);
let {code} = generator(ast, {jsescOption:{"minimal":true}});
console.log(code);
