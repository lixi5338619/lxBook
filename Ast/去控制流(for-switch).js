
const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode =
`
function test() {
  for (var index = 0; index != 5;) {
    switch (index) {
      case 0:
        console.log("This is case-block 0");
        index = 3;
        continue;

      case 1:
        console.log("This is case-block 1");
        return;
        index = 5;
        continue;

      case 2:
        console.log("This is case-block 2");
        index = 1;
        continue;

      case 3:
        console.log("This is case-block 3");
        index = 4;
        continue;

      case 4:
        console.log("This is case-block 4");
        index = 2;
        continue;
    }

    break;
  }
}
`;

let ast = parse(jscode);

const visitor =
    {
        ForStatement(path) {
            //遍历for语句
            const { init, update, test, body } = path.node;

            //特征判断
            if (
                !t.isVariableDeclaration(init) ||
                !t.isBinaryExpression(test) ||
                update !== null
            )
                return;

            let declaration = init.declarations[0];

            //获取控制循环的变量及其初始值
            const init_name = declaration.id.name;
            let init_value = declaration.init.value;
            let { left, right, operator } = test;

            //特征判断
            if (
                !t.isIdentifier(left, { name: init_name }) ||
                operator !== "!=" ||
                !t.isNumericLiteral(right)
            )
                return;

            let test_value = right.value;
            let switch_body = body.body[0];

            //特征判断
            if (!t.isSwitchStatement(switch_body)) return;
            let { discriminant, cases } = switch_body;

            if (!t.isIdentifier(discriminant, { name: init_name })) return;
            let ret_body = [];
            let end_flag = false;

            //不断的拿到控制循环的变量值
            while (init_value !== test_value) {
                //如果没有与之匹配的值，直接跳出循环
                if (end_flag === true) {
                    //如果遇到return语句，直接跳出循环
                    break;
                }

                for (const each_case of cases) {
                    let { test, consequent } = each_case;

                    if (init_value !== test.value) {
                        continue;
                    }

                    if (t.isContinueStatement(consequent[consequent.length - 1])) {
                        //如果是continue语句，直接删除
                        consequent.pop();
                    }

                    if (t.isExpressionStatement(consequent[consequent.length - 1])) {
                        //如果是表达式语句，则判断是否包含控制循环的变量的赋值语句
                        let { expression } = consequent[consequent.length - 1];
                        if (t.isAssignmentExpression(expression)) {
                            let { left, right, operator } = expression;
                            if (t.isIdentifier(left, { name: init_name })) {
                                //更新控制循环的变量值，并进行删除
                                init_value = right.value;
                                consequent.pop();
                            }
                        }
                    }

                    if (t.isReturnStatement(consequent[consequent.length - 1])) {
                        end_flag = true;
                    }
                    ret_body = ret_body.concat(consequent);
                    break;
                }
            }
            path.replaceInline(ret_body);
        }

    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);

