
const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode =
`
var arr = "3|0|1|2|4".split("|");
var cnt = 0;

while (true) {
  switch (arr[cnt++]) {
     case "1":
      console.log("This is case-block 1");
      continue;
      
    case "0":
      console.log("This is case-block 0");
      continue;

    case "2":
      console.log("This is case-block 2");
      continue;

    case "4":
      console.log("This is case-block 4");
      continue;
      
    case "3":
      console.log("This is case-block 3");
      continue;
  }

  break;
}
`;

let ast = parse(jscode);

const visitor =
    {
        WhileStatement(path) {
            const { test, body } = path.node;

            //特征语句判断，视情况而定，也可以不判断
            if (!t.isBooleanLiteral(test) || test.value !== true) return;

            //特征语句判断，body.body[0] 必须是 SwitchStatement 节点，
            //注意一定要先判断长度，避免index出错
            if (body.body.length === 0 || !t.isSwitchStatement(body.body[0])) return;

            let switch_state = body.body[0];

            //获取discriminant及cases节点
            let { discriminant, cases } = switch_state;

            //特征语句判断，经过此判断后，基本可以确定是需要还原的while节点了。
            //如果出错了，可以继续增加判断，直到不出错即可
            if (!t.isMemberExpression(discriminant) || !t.isUpdateExpression(discriminant.property)) return;

            //获取数组名，用于查找该数组。
            let arr_name = discriminant.object.name;
            let arr = [];

            //在这里再加一个特征语句的判断：WhileStatement 节点前面有两个节点
            let all_pre_siblings = path.getAllPrevSiblings();
            if (all_pre_siblings.length !== 2) return;

            all_pre_siblings.forEach((pre_path) => {
                //虽然知道是第0个节点，但这里还是做下判断取arr
                const { declarations } = pre_path.node;
                let { id, init } = declarations[0];

                if (arr_name === id.name) {
                    //如果是定义arr的节点，拿到该arr的值
                    arr = init.callee.object.value.split("|");
                }

                //没啥用的语句可以直接删除
                pre_path.remove();
            });

            //新建一个数组变量，用于存放 case 节点
            let ret_body = [];

            arr.forEach((index) => {
                //遍历数组，去case节点
                let case_body = [];
                for (const tmp of cases){
                    if(index === tmp.test.value){
                        case_body = tmp.consequent;
                        break;
                    }
                }

                if (t.isContinueStatement(case_body[case_body.length - 1])) {
                    //删除 continue语句
                    case_body.pop();
                }

                //存放于数组变量中
                ret_body = ret_body.concat(case_body);
            });

            //替换
            path.replaceInline(ret_body);
        }
    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);


/*
去控制流(while-switch), 代码不通用，存在优化空间，
比如将 case 做个键值对映射，这样直接取结果就比循环判断好一些
 */
