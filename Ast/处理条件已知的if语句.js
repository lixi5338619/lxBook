const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

// let jscode = "if (true)\n" +
//     "{\n" +
//     "   //do something;\n" +
//     "  funcA();\n" +
//     "}\n" +
//     "else\n" +
//     "{\n" +
//     "   //do something;\n" +
//     "  funcB();\n" +
//     "}";

let jscode = "if ('123'==='123')\n" +
    "   a = 123;\n" +
    "else\n" +
    "  a = 456;";

let ast = parse(jscode);

const visitor1 =
    {
        BinaryExpression(path) {
            let {confident, value} = path.evaluate();
            // console.log(path.type, confident, value)
            if (confident) {
                // console.log(path.node);
                path.replaceInline(t.valueToNode(value))

            }
        }
    }

const visitor2 =
    {
        IfStatement(path) {
            let {test, consequent, alternate} = path.node;

            if (!t.isBlockStatement(consequent)) {//添加中括号
                path.node.consequent = t.BlockStatement([consequent]);
            }

            if (alternate !== null && !t.isBlockStatement(alternate)) {//添加中括号
                path.node.alternate = t.BlockStatement([alternate]);
            }

            //特征判断，if语句里面的test是否为字面量
            if (!t.isLiteral(test)) return;

            let value = test.value;
            consequent = path.node.consequent;
            alternate = path.node.alternate;

            if (value) {//替换
                path.replaceInline(consequent.body);
            } else {//替换
                alternate === null ? path.remove() : path.replaceInline(alternate.body);
            }
        },
    }

//some function code


traverse(ast, visitor1);
traverse(ast, visitor2);
let {code} = generator(ast);
console.log(code);

/*
if (true)
//do something;
else
//do something;

与
if (true)
{
    //do something;
}
else
{
    //do something;
}

解析出来的结构会有小小的差异，不利于处理，因此先将上面的代码转变为下面的代码，再进行处理即可

1.先将if语句块中没有 中括号的处理成 包含中括号的
2.判断if条件里面的值，获取应该执行的语句块
3.用语句块替换整个if表达式即可。

*/
