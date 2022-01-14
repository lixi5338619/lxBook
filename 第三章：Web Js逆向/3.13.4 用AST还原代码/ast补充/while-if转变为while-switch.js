
const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode =
    `
function test() {
  var index = 0,
      arr = [3, 0, 2, 1],
      pindex;

  while (1) {
    pindex = arr[index++];

    if (pindex < 1) {
      console.log("this is index 0");
    } else if (pindex < 2) {
      console.log("this is index 1");
      return;
    } else if (pindex < 3) {
      console.log("this is index 2");
    } else {
      console.log("Hello world!");
    }
  }
}
`;

let ast = parse(jscode);

const visitor =
    {
        "WhileStatement"(path) {
            let {test, body} = path.node;

            //******************************************************特征判断开始
            if (!t.isNumericLiteral(test, {value: 1})) return;

            let block_body = body.body;

            if (block_body.length !== 2 || !t.isExpressionStatement(block_body[0]) || !t.isIfStatement(block_body[1])) {
                return;
            }
            //******************************************************特征判断结束

            let {left, right} = block_body[0].expression;
            let name = left.name;

            let if_arrs = [];
            path.traverse({
                "IfStatement"(_path) {

                    let {test, consequent, alternate} = _path.node;

                    let {left, operator, right} = test;

                    if (!t.isIdentifier(left, {name: name}) || operator !== '<' || !t.isNumericLiteral(right)) return;

                    if (consequent.body.length === 1) {
                        if_arrs[right.value - 1] = consequent.body[0];
                    } else {
                        if_arrs[right.value - 1] = consequent;
                    }

                    if (!t.isIfStatement(alternate)) {
                        if (consequent.body.length === 1) {
                            if_arrs[right.value] = alternate.body[0];
                        } else {
                            if_arrs[right.value] = alternate;
                        }
                    }
                },
            })

            if (if_arrs.length === 0) return;

            for (var i = 0; i < if_arrs.length - 1; i++) {
                consequent = [if_arrs[i], t.BreakStatement()];
                if_arrs[i] = t.SwitchCase(test = t.NumericLiteral(i), consequent = consequent);
            }

            consequent = [if_arrs[if_arrs.length - 1], t.BreakStatement()];
            if_arrs[i] = t.SwitchCase(test = null, consequent = consequent);

            let new_node = t.SwitchStatement(right, if_arrs);

            path.get('body.body.1').replaceInline(new_node);
            path.get('body.body.0').remove();
        },
    }


//some function code


traverse(ast, visitor);
let {code} = generator(ast);
console.log(code);