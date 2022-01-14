const parser = require("@babel/parser");
const template = require("@babel/template").default;
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;
const fs = require("fs");
const path = require('path');
// lx.js 是被混淆的js文件
var jscode = fs.readFileSync("lx.js", { encoding: "utf-8"});

const visitor_string = {
    'StringLiteral|NumericLiteral'(path) {
        delete path.node.extra
    }
};

const visitor_number = {
    'UnaryExpression'(path) {
        const {value} = path.evaluate();
        switch (typeof value) {
            case 'boolean':
                path.replaceWith(t.BooleanLiteral(value))
                break;
            case 'string':
                path.replaceWith(t.StringLiteral(value))
                break;
            case 'number':
                path.replaceWith(t.NumericLiteral(value))
                break;
            default:
                break;
        }
    }
}
const visitor_function = {
    MemberExpression(path) {
        let property = path.get('property')
        if (property.isStringLiteral()) {
            let value = property.node.value;
            path.node.computed = false
            property.replaceWith(t.Identifier(value))
        }
    }
};
const visitor_del_cons =
    {
        VariableDeclarator(path) {
            const {id} = path.node;
            const binding = path.scope.getBinding(id.name);
            if (!binding || binding.constantViolations.length > 0) {
                return;
            }
            if (binding.referencePaths.length === 0) {
                path.remove();
            }
        },
    }

const visitor_eval =
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

// 将JS源码转换成语法树
let ast = parser.parse(jscode);
traverse(ast, visitor_string);     //识别字符串
traverse(ast, visitor_number);     //计算表达式 !![] -> true
traverse(ast, visitor_function);   //将a["length"]转为a.length
traverse(ast, visitor_del_cons);   //删除未被调用的变量
traverse(ast, visitor_eval);       //处理eval函数
let {code} = generator(ast, {jsescOption: {"minimal": true}});
fs.writeFile('lx_decoded.js', code, (err) => {});