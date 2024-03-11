// 以下为源码的正则  对正则表达式不清楚的同学可以参考小编之前写的文章(前端进阶高薪必看 - 正则篇);
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //匹配标签名 形如 abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //匹配特殊标签 形如 abc:234 前面的abc:可有可无
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签开始 形如 <abc-123 捕获里面的标签名
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束  >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾 如 </abc-123> 捕获里面的标签名
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性  形如 id="app"
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{}}
let root, currentParent; //根元素和当前元素的父节点
//解析模板时使用了一个堆栈来跟踪组件的嵌套关系。每当解析器遇到一个开始标签时，会将该元素创建为一个AST元素，并将其推入堆栈中。同时，currentParent 变量也会被更新为当前操作的父级元素。
let stack = []; //栈结构，表示开始和结束标签
// 节点类型
const ELEMENT_TYPE = 1; // 标签
const TEXT_TYPE = 3; // 文本
function createASTElement(tagName, attrs) {
  return {
    type: ELEMENT_TYPE,
    tag: tagName,
    attrs,
    children: [],
    parent: null,
  };
}
function handleStartTag(tag, attrs) {
  //开始标签
//   console.log("开始标签", tag, attrs);
  let element = createASTElement(tag, attrs);
  if (!root) {
    root = element;
  }
  currentParent = element;
  stack.push(element); //将当前正在处理的元素推入堆栈中，以便在处理完当前元素的子元素后，可以从堆栈中弹出上一个元素作为新的当前父级元素。
//   console.log("开始标签stack=", stack);
}
function handleCharts(text) {
  //获取文本
//   console.log("获取文本", text);
    text = text.replace(/\s/g,'')
    if(text){
        currentParent.children.push({
            type: TEXT_TYPE,
            text,
        })
    }
}
function handleEndTag(tag) {
  //结束标签
//   console.log("结束标签", stack);
  let element = stack.pop(); //操作从栈顶中取出最近的元素，并将其赋值给变量 element。这个元素是当前正在处理的结束标签对应的 AST 元素
  currentParent = stack[stack.length - 1]; //获取栈顶上一个元素，并将其赋值给变量 currentParent。这个元素即为当前元素的父级元素。
//   console.log("结束标签-element", element, currentParent);
  //建立currentParent 和 children的关联
  if (currentParent) {
    //建立父子关系：首先，将 element.parent 设置为 currentParent，以表明 element 的父级元素是 currentParent。接下来，将 element 添加到 currentParent.children 数组中，以表明 element 是 currentParent 的子元素
    element.parent = currentParent;
    currentParent.children.push(element);
  }
}
// 初步形态
export function parseHTML(html) {
  //开始标签
  while (html) {
    //判断标签<>
    let text;
    let textEnd = html.indexOf("<");
    if (textEnd === 0) {
      //标签
      //（1） 开始标签
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        handleStartTag(startTagMatch.tagName, startTagMatch.attrs);
      }
      //结束标签
      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        handleEndTag(endTagMatch[1]);
      }
      continue;
    }
    if (textEnd > 0) {
      //文本
      // console.log('text=',textEnd)
      //获取文本内容
      text = html.substring(0, textEnd);
      // console.log("text-2=", text);
    }
    if (text) {
      advance(text.length);
      handleCharts(text);
    }
    // break;
  }
  function parseStartTag() {
    const start = html.match(startTagOpen); // 只会有两种情况： 结果 || false
    // console.log("parseStartTag", html,start);
    if (start) {
      // ast结构
      let match = {
        tagName: start[1],
        attrs: [],
      };
      advance(start[0].length); //删除掉
      //标签上的属性
      //注意 会有多个属性 需要遍历
      //也要注意 >
      let attr, end;
      // 不是结尾标签 且是属性
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        // console.log('attr=',attr)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
        advance(attr[0].length); // 又要删除
        // break;
      }
      if (end) {
        // console.log('end=',end)
        advance(end[0].length);
        return match;
      }
    }
  }
  function advance(n) {
    html = html.substring(n);
    // console.log("此时的HTML", html);
    // return html
  }
  //   返回生成的ast
  return root;
}
