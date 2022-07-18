

const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "var a = 123; //this is single line comment\n" +
    "\n" +
    "/*\n" +
    "\n" +
    "This is a  multiline comments;\n" +
    "\n" +
    "test\n" +
    "\n" +
    "test\n" +
    "\n" +
    "test\n" +
    "\n" +
    "*/\n" +
    "\n" +
    "var b = 456;";

let ast = parse(jscode);

const visitor =
    {
        //TODO  write your code here！
    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast, {comments:false});
console.log(code);
