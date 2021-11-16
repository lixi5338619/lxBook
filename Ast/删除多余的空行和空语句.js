
const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "var a = 123;\n" +
    "\n" +
    ";\n" +
    "\n" +
    "var b = 456;";

let ast = parse(jscode);

const visitor =
    {
        EmptyStatement(path)
        {
            path.remove();
        },
    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);