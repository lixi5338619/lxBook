/*
*/

const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "function add(a, b) {\n" +
    "  return a + b;\n" +
    "}\n" +
    "\n" +
    "let c = add(1, 2);";

let ast = parse(jscode);

const visitor =
    {
        FunctionDeclaration(path) {
            let {id} = path.node;
            let code = path.toString();
            if (code.indexOf("try") !== -1 || code.indexOf("random") !== -1 || code.indexOf("Date") !== -1) {
                // 不是纯函数，不处理
                return
            }

            eval(code);

            let scope = path.scope;
            const binding = path.scope.parent.getBinding(id.name);

            if (!binding || binding.constantViolations.length > 0) {
                return
            }

            for (const refer_path of binding.referencePaths) {
                // 查找父节点
                let call_express = refer_path.findParent(p => p.isCallExpression());

                let arguments = call_express.get("arguments");
                let args = [];

                // 判断参数是否为 Literal 类型
                arguments.forEach(arg => {
                    args.push(arg.isLiteral())
                })

                // 自行编写判断条件，example
                if (args.length === 0 || args.indexOf(false) !== -1) {
                    continue
                }

                try {
                    // 计算值
                    let value = eval(call_express.toString());
                    value && call_express.replaceWith(t.valueToNode(value));
                } catch (e) {

                }
            }

        }
    }


//some function code


traverse(ast, visitor);
let {code} = generator(ast);
console.log(code);


/*
1.函数需要满足在任意位置都能执行。就是一个函数声明的代码，随便拷贝到任意的地方都能直接运行，不会报错。说白了其实也就是函数体内的所有变量或者对象，其作用域只在函数体里面。
2.定义的函数，对于实参是固定的，其结果也是固定的。请大家自行百度 纯函数 的概念
3.实参必须是字面量，因为对于遍历的节点来说。只有是字面量，才能给你计算出具体的字，如果不是字面量，实参对它来说就是 undefined 的，是无法计算的。
4.将函数定义eval到本地环境，然后根据作用域找到函数调用的位置。再eval该表达式即可。注意需要使用try...catch语句，避免错误。
*/

