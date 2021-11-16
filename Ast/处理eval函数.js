
const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "eval('var a = 123;');";

let ast = parse(jscode);

const visitor =
    {
        CallExpression(path)
        {
            let {callee,arguments} = path.node;
            if (!t.isIdentifier(callee,{name:'eval'})) return;
            if (arguments.length !== 1 || !t.isStringLiteral(arguments[0])) return;
            let value = arguments[0].value;
            path.replaceWith(t.Identifier(value));
        },
    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);