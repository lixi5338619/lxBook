/*
desc    : 把 a = m?11:22; 转成 m ? a = 11 : a = 22;
*/

const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "a = m ? 11 : 22;";

let ast = parse(jscode);

const visitor =
    {
        ConditionalExpression(path){
            let {test, consequent, alternate} = path.node;
            const ParentPath = path.parentPath;
            if(t.isAssignmentExpression(ParentPath)){
                let {operator, left} = ParentPath.node;
                if (operator === '='){
                    consequent = t.AssignmentExpression('=', left, consequent);
                    alternate = t.AssignmentExpression('=', left, alternate);
                    ParentPath.replaceWith(t.ConditionalExpression(test, consequent, alternate))
                }
            }
        }
    }

//some function code

traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);

/*

1.节点类型变了，由 AssignmentExpression 类型变成了ConditionalExpression 类型。
2.ConditionalExpression 子节点的 consequent 和 alternate 都变成了 AssignmentExpression 类型。

*/
