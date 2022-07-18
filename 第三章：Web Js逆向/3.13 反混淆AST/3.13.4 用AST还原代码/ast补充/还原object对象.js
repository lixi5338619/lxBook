/*
date    : 2020/8/11
desc    : 
*/

const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "var a = {\n" +
    "  \"YJJox\": \"object\",\n" +
    "  \"sbTga\": function (b, c) {\n" +
    "    return b | c;\n" +
    "  },\n" +
    "  \"iwvEK\": function (b, c) {\n" +
    "    return b << c;\n" +
    "  },\n" +
    "  \"HqkiD\": function (b, c) {\n" +
    "    return b(c);\n" +
    "  }\n" +
    "};\n" +
    "b = a[\"iwvEK\"](1, 3), c = a[\"sbTga\"](111, 222), d = a[\"YJJox\"], e = a[\"HqkiD\"](String.fromCharCode, 49);";

let ast = parse(jscode);

const visitor =
    {
        VariableDeclarator(path) {
            const {id, init} = path.node;

            //特征判断，对象为空则不处理
            if (!t.isObjectExpression(init) || init.properties.length === 0) return;

            let name = id.name;
            let scope = path.scope;

            for (const property of init.properties) {//遍历key、value
                let key = property.key.value;
                let value = property.value;

                //一般ob混淆，key长度都是5，也有是3的，自行调整即可。
                if (key.length !== 5) return;

                //如果是字面量
                if (t.isLiteral(value)) {
                    scope.traverse(scope.block, {
                        //遍历MemberExpression，找出与key相同的表达式
                        MemberExpression(_path) {
                            let _node = _path.node;
                            if (!t.isIdentifier(_node.object, {name: name})) return;
                            if (!t.isLiteral(_node.property, {value: key})) return;
                            _path.replaceWith(value);
                        },
                    })
                }
                //如果是函数表达式
                else if (t.isFunctionExpression(value)) {
                    let ret_state = value.body.body[0];

                    //特征判断，如果不是return表达式
                    if (!t.isReturnStatement(ret_state)) continue;

                    scope.traverse(scope.block, {
                        CallExpression: function (_path) {

                            //遍历CallExpression
                            let {callee, arguments} = _path.node;
                            if (!t.isMemberExpression(callee)) return;
                            if (!t.isIdentifier(callee.object, {name: name})) return;
                            if (!t.isLiteral(callee.property, {value: key})) return;
                            if (t.isCallExpression(ret_state.argument) && arguments.length > 0) {

                                //构造节点
                                _path.replaceWith(t.CallExpression(arguments[0], arguments.slice(1)));
                            } else if (t.isBinaryExpression(ret_state.argument) && arguments.length === 2) {

                                //构造节点
                                let replace_node = t.BinaryExpression(ret_state.argument.operator, arguments[0], arguments[1]);
                                _path.replaceWith(replace_node);
                            } else if (t.isLogicalExpression(ret_state.argument) && arguments.length === 2) {

                                //构造节点
                                let replace_node = t.LogicalExpression(ret_state.argument.operator, arguments[0], arguments[1]);
                                _path.replaceWith(replace_node);
                            }
                        }
                    })
                }
            }
        },
    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);

/*
1.这里是 VariableDeclarator 节点，子节点 init 是 ObjectExpression 类型的表达式，因此我们可以遍历VariableDeclarator节点，便于获取 对象名 及整个对象
2.遍历 ObjectExpression 节点的 properties 属性，它是一个 数组，遍历这个数组，获取key和value
3.判断 value 的节点类型，如果是字面量，则可以直接进行替换；如果是函数表达式，则需要通过返回的表达式类型构造相应的表达式。然后在作用域块内遍历 MemberExpression (PS：a["sbTga"]) 节点，如果是对象名，并且当前的key值也相等，则进行节点替换。
4.遍历 properties 完毕后，可以试着删除整个  VariableDeclarator 节点，如果不报错就没事。
*/
