/*
date    : 2020/8/11
desc    : 
*/

const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "var s = 92;\n" +
    "b = Z(1324801, 92);";

let ast = parse(jscode);

const visitor =
    {
        "Identifier"(path)
        {
            const {confident,value} = path.evaluate();
            confident && path.replaceInline(t.valueToNode(value));
        },

        // 替换完了就没用了，将其删除
        VariableDeclarator(path)
        {
            const {id,init} = path.node;

            if (!t.isLiteral(init)) return;//只处理字面量

            const binding = path.scope.getBinding(id.name);

            if (!binding || binding.constantViolations.length > 0)
            {//如果该变量的值被修改则不能处理
                return;
            }

            for (const refer_path of binding.referencePaths)
            {
                refer_path.replaceWith(init);
            }
            path.remove();
        },
    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);