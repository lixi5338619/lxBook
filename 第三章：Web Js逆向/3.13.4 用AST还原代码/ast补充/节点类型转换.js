/*
desc    : 将 BinaryExpression 类型转换为 CallExpression 类型
*/

const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "var a = 123 | 456;";

let ast = parse(jscode);

const visitor =
    {
        "VariableDeclarator"(path)
        {
            const init_path = path.get('init');
            if (!init_path.isBinaryExpression()) return

            init_path.node.type = "CallExpression";
            let {operator,left,right} = init_path.node;
            init_path.node.arguments = [left,right];

            let id = null;
            let frist_arg  = t.Identifier('s');
            let second_arg = t.Identifier('h');
            let params = [frist_arg,second_arg];

            let args = t.BinaryExpression(operator,frist_arg,second_arg);
            let return_state = t.ReturnStatement(args);

            let body = t.BlockStatement([return_state]);
            init_path.node.callee = t.FunctionExpression(id ,params,body);
        },
    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);