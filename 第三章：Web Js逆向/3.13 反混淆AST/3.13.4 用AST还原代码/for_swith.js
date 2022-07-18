const visitor =
    {
        ForStatement(path) {
            const { init, update, test, body } = path.node;
            if (
                !t.isVariableDeclaration(init) ||
                !t.isBinaryExpression(test) ||
                update !== null
            )
                return;

            let declaration = init.declarations[0];

            const init_name = declaration.id.name;
            let init_value = declaration.init.value;
            let { left, right, operator } = test;
            //判断特征
            if (
                !t.isIdentifier(left, { name: init_name }) ||
                operator !== "!=" ||
                !t.isNumericLiteral(right)
            )
                return;

            let test_value = right.value;
            let switch_body = body.body[0];

            //判断特征
            if (!t.isSwitchStatement(switch_body)) return;
            let { discriminant, cases } = switch_body;

            if (!t.isIdentifier(discriminant, { name: init_name })) return;
            let ret_body = [];
            let end_flag = false;

            while (init_value !== test_value) {
                if (end_flag === true) {
                    break;
                }

                for (const each_case of cases) {
                    let { test, consequent } = each_case;
                    if (init_value !== test.value) {
                        continue;
                    }
                    if (t.isContinueStatement(consequent[consequent.length - 1])) {
                        consequent.pop();
                    }
                    if (t.isExpressionStatement(consequent[consequent.length - 1])) {
                        let { expression } = consequent[consequent.length - 1];
                        if (t.isAssignmentExpression(expression)) {
                            let { left, right, operator } = expression;
                            if (t.isIdentifier(left, { name: init_name })) {
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