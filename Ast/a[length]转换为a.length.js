const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "a['length']";

let ast = parse(jscode);

const visitor =
    {
        "MemberExpression"(path){
            let property = path.get('property');
            if(property.isStringLiteral()){
                let value = property.node.value;
                path.node.computed = false;
                property.replaceWith(t.Identifier(value))
            }
        }
    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);