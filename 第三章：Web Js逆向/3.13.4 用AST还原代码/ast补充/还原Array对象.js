/*
*/

const fs = require('fs');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

let jscode = "var _2$SS = function (_SSz, _1111) {\n" +
    "    var _l1L1 = [46222, '\x74\x61\x43\x61\x70\x74\x63\x68\x61\x42\x6c\x6f\x62', '\x74', '\x61', '\x73', '\x6c', '\x64', '\x69', .3834417654519915, '\x65\x6e\x63\x72\x79\x70\x74\x4a', '\x73\x6f', '\x6e', 49344];\n" +
    "\n" +
    "    var _2Szs = _l1L1[5] + _l1L1[7] + (_l1L1[4] + _l1L1[2]),\n" +
    "        _I1il1 = _l1L1[9] + (_l1L1[10] + _l1L1[11]);\n" +
    "\n" +
    "    var _0ooQoO = _l1L1[0];\n" +
    "    var _$Z22 = _l1L1[12],\n" +
    "        _2sS2 = _l1L1[8];\n" +
    "    return _l1L1[6] + _l1L1[3] + _l1L1[1];\n" +
    "};";

let ast = parse(jscode);

const visitor =
    {
        VariableDeclarator(path){
            // 还原数组对象
            const {id, init} = path.node;

            // 非Array或者没有元素， 返回
            if (!t.isArrayExpression(init) || init.elements.length===0) return;

            let elements = init.elements;

            // 获取binding实例
            const binding = path.scope.getBinding(id.name);

            for ( const ref_path of binding.referencePaths){
                // 获取 MemberExpression 父节点
                let member_path = ref_path.findParent(p=>p.isMemberExpression());
                let property = member_path.get('property');

                // 索引值不是 NumericLiteral 类型的不处理
                if(!property.isNumericLiteral()){
                    continue;
                }

                // 获取索引值
                let index = property.node.value;

                // 获取索引值对应的节点， 并替换
                let arr_ele = elements[index];
                member_path.replaceWith(arr_ele)
            }
        }
    }


//some function code


traverse(ast,visitor);
let {code} = generator(ast);
console.log(code);