
const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode =
`
var h = {};
h["aaa"] = "hello wolrd";
h["bbb"] = function (a,b)
{
   return a | b;
}
`;

let ast = parse(jscode);

const visitor =
    {
        VariableDeclarator(path)
        {
            const {id,init} = path.node;
            if (!t.isObjectExpression(init)) return;
            let name = id.name;
            let properties = init.properties;
            let all_next_siblings = path.parentPath.getAllNextSiblings();

            for (let next_sibling of all_next_siblings)
            {
                if (!next_sibling.isExpressionStatement())  break;

                let expression = next_sibling.get('expression');
                if (!expression.isAssignmentExpression()) break;
                let {operator,left,right} = expression.node;

                if (operator !== '=' || !t.isMemberExpression(left) || !t.isIdentifier(left.object,{name:name}))
                {
                    break;
                }
                properties.push(t.ObjectProperty(left.property,right));
                next_sibling.remove();
            }
        },
    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);


/*

1.object对象使用var定义的，因此遍历 VariableDeclarator 节点即可
2.依次判断后续节点，是否为定义在外面的key和value
3.收集key和value，用于构造ObjectProperty 节点
4. properties  属性是Array对象，只用push方法来增加节点
5.处理完成后删除后续节点。

 */