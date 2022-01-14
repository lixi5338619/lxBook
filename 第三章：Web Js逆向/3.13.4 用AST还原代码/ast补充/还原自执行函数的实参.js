/*
*/

const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "!function (a, b) {\n" +
    "  c = a | b;\n" +
    "}(111, 222);";

let ast = parse(jscode);

const visitor =
    {
        CallExpression(path){
            let callee = path.get('callee');
            let arguments = path.get('arguments');

            if(!t.isFunctionExpression(callee) || arguments.length ===0){
                // 实参的长度判断可以写死
                return;
            }

            // 获取形参
            let params = callee.get('params');
            let scope = callee.scope;

            for ( let i =0; i< arguments.length; i++){
                // 遍历实参， 因为形参可能比实参长
                let arg = params[i];
                let {name} = arg.node;

                const binding = scope.getBinding(name);

                if(!binding || binding.constantViolations.length > 0){
                    // 形参发生改变，不能被还原
                    continue;
                }

                for(refer_path of binding.referencePaths){
                    // 字面量可以直接替换
                    refer_path.replaceWith(arguments[i]);
                }

                arg.remove();
                arguments[i].remove();
            }
        }
    }

//some function code

traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);

// 替换完之后可以通过无参的自执行插件再替换