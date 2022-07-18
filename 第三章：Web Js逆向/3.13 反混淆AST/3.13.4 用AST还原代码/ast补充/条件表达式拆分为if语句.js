/*
*/

const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode =
`
r ? r > 1 ? e.apply(t, arguments) : e.call(t, n) : e.call(t);
`;

let ast = parse(jscode);

const visitor =
    {
        ConditionalExpression(path) {
            let { test, consequent, alternate } = path.node;
            const ParentPath = path.parentPath;
            if (t.isExpressionStatement(ParentPath)) {
                if (!t.isExpressionStatement(consequent)) {
                    consequent = t.BlockStatement([t.ExpressionStatement(consequent)]);
                }
                if (!t.isExpressionStatement(alternate)) {
                    alternate = t.BlockStatement([t.ExpressionStatement(alternate)]);
                }
                ParentPath.replaceInline(t.IfStatement(test, consequent, alternate));
            }
        }
    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);

/*

r ? r > 1 ? e.apply(t, arguments) : e.call(t, n) : e.call(t);


if (r) {
  if (r > 1) {
    e.apply(t, arguments);
  } else {
    e.call(t, n);
  }
} else {
  e.call(t);
}
 */