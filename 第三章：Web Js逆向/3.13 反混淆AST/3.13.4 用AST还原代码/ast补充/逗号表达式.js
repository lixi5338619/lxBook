/*
*/

const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode =
`
b = (0,g.o)(a);

c = (a=1,b=2,c=3,d=4,e=5,f);

function get()
{
	return a=1,b=2,a +=2,a;
}
`;

let ast = parse(jscode);

const visitor =
    {
        SequenceExpression: {
		    exit(path){
                let expressions = path.get('expressions');
                let last_expression = expressions.pop();
                
                let statement = path.getStatementParent();
                
                if(statement){
                    for(let expression of expressions)
                    {
                        // 删除无用的干扰代码
                        if(expression.isLiteral() ||expression.isIdentifier())
                        {
                            expression.remove();
                            continue;
                        }
                        statement.insertBefore(types.ExpressionStatement(expression=expression.node));
                    }
				    path.replaceInline(last_expression);
                }
            }
        }
    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);


/*******************************************
b = (0,g.o)(a);

c = (a=1,b=2,c=3,d=4,e=5,f);

function get()
{
	return a=1,b=2,a +=2,a;
}

===>

b = g.o(a);
a = 1;
b = 2;
c = 3;
d = 4;
e = 5;
c = f;

function get() {
  a = 1;
  b = 2;
  a += 2;
  return a;
}

******************************************/
