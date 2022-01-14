
const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "var a = 123,b;\n" +
    "\n" +
    "let c = 4 + 5;\n" +
    "\n" +
    "d = a + 12;";

let ast = parse(jscode);

const visitor =
    {
        VariableDeclarator(path) {

            const {id} = path.node;
            const binding = path.scope.getBinding(id.name);

            //如果变量被修改过，则不能进行删除动作。
            if (!binding || binding.constantViolations.length > 0) {
                return;
            }

            //长度为0，说明变量没有被使用过。
            if (binding.referencePaths.length === 0) {
                path.remove();
            }
        },
    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);