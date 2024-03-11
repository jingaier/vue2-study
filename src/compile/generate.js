const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{}} 检查文本有咩有 插值表达式
//处理属性
function genProps(attrs) {
  let str = "";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === "style") {
      let obj = {};
      attr.value.split(";").forEach((item) => {
        let [key, val] = item.split(":");
        obj[key] = val;
      });
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}
//处理节点
function genChildren(node){
    let children = node.children//
    if(children){
        console.log(
          "ddd=",
          children
        );
        return children.map(child=>gen(child)).join(',')
    }
}
function gen(node) {
  if (node.type === 1) {
    //节点 div
    return generate(node);
  } else {
    //文本（这里注意文本会有两种情况：纯文本，还有就是带有{{}}）
    let text = node.text
    if(!defaultTagRE.test(text)){
        return `_v(${JSON.stringify(text)})`
    }
    //接下来就是含有{{}}插值的情况
    let tokens = []
    let lastIndex = defaultTagRE.lastIndex = 0 // 这里每次用过正则判断后都要设置为0
    let match
    while (match = defaultTagRE.exec(text)) {
      let index = match.index
      if(index > lastIndex){
        tokens.push(JSON.stringify(text.slice(lastIndex,index)))// 内容
      }
      // {{}}
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
      // 如果后面还有{{}}
      console.log("lastIndex=", lastIndex,text);
    }
    if(lastIndex<text.length){
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    console.log('tokens=',tokens)
    return `_v(${tokens.join('+')})`
  }
}
export function generate(el) {
  //拼接字符串
  // 这里注意 行内样式例如：style="color:red;font-size:20px;"
  let children = genChildren(el);
  let code = `_c('${el.tag}',${
    el.attrs.length ? `${genProps(el.attrs)}` : "undefined"
  }${children ? `,${children}` : ""})`;
  return code;
}
