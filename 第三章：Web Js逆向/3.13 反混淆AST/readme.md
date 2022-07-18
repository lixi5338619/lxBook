可能大家对ast不太理解，其实是通过生成语法树(AST)，可快速修改代码中的一些混淆处理，从而简化代码，便于后续分析。

比如通过Python来把JS转为AST并进行简单的操作，内容很简单。



比如我们下图中的JS代码，有sum和minus两个函数，一个变量a，两个换行\n，以及一次sum函数的调用，参数为1和2。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ab7b48fbb46d4a6581082aeb4a6a60c8.png)


通过pyjsparser库将script代码转换成为json-ast格式。


pyjsparser是目前用于 python 的最快和最易理解的 JavaScript 解析器。可将JavaScript翻译成Python，即在Python中运行JavaScript代码。



import pyjsparser
js_ast = pyjsparser.parse(script)



转换后用Json格式化工具打开。

![在这里插入图片描述](https://img-blog.csdnimg.cn/f909c4d84d7e4df79ffb228408ab72fa.png)

  在body下的元素有这几种类型：
          函数声明：FunctionDeclaration
          空语句(\n)：EmptyStatement
          变量声明：VariableDeclaration
          表达式语句：ExpressionStatement

根据Json可看到FunctionDeclaration中有基本的函数名、参数名、参数类型、块语句和返回语句等。



此外，表达式语句中还有调用表达式(CallExpression)、二元表达式(BinaryExpression)、赋值表达式(AssignmentExpression)等等。




那么我们就可以通过这些Type，以修改Json对象的方式去操作这棵语法树。比如根据是否被调用去删除一些无用的对象，删除未调用的函数，或根据规则去替换一些结构，修改一些节点。

![在这里插入图片描述](https://img-blog.csdnimg.cn/3a2842229fc44be8aa512aae6b0830de.png)

假如这是一段时间长并且难以阅读的代码，我们需要先将其转为AST，然后遍历所有函数，来查找未被调用的方法，然后进行删除，再根据AST转回正常的JS代码。



```python
# 完整代码如下，大家自己试试删除无用变量a吧！
# js2py依赖于pyjsparser，所以安装js2py即可安装pyjsparser
# pip install js2py
script = '''
    function sum(a,b){  
        c = minus(2,3)
        return a+c;
    };
    
    function minus(a2,b2){  
        return a2-b2;
    };
    
    function dddd(a2,b2){  
        return a2-b2;
    };
    
    var a = 123;
    sum(1,2)
'''

import pyjsparser
js_ast = pyjsparser.parse(script)
# 获取所有方法
funcList = []
for i in js_ast['body']:
    if i['type'] =='FunctionDeclaration':
        name = i['id']['name']
        funcList.append(name)

# 查找未被调用的方法
noCallList = []
for func in funcList:
    searchStatement = "{'type': 'CallExpression', 'callee': {'type': 'Identifier', 'name': '%s'}"%func
    if searchStatement not in str(js_ast):
        noCallList.append(func)

# 删除未调用的方法
for i in js_ast['body']:
    if i['type'] =='FunctionDeclaration':
        if i['id']['name'] in noCallList:
            js_ast['body'].remove(i)

#js_ast['body'][0]['id']['name'] = 'pythonlx'  # 修改一个函数名

# 用AST重新生成js代码
import js2py.py_node_modules.escodegen as escodegen
escodegen = escodegen.var.get('escodegen')
res = escodegen.get('generate')(js_ast)
print(res.to_python()
```



执行后，可以发现未被调用的dddd方法已经被删除。

代码很简单，大家试试如何删除无关变量a吧！

本文牛刀小试，更多内容我们后续再见！

![在这里插入图片描述](https://img-blog.csdnimg.cn/d046fa03df384dbda997bbb0fd01944d.png)