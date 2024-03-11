// patch是用来渲染和更新视图的（这里只介绍首次渲染）
export function patch(oldVnode,vnode){
    // 判断传入的oldVnode是不是一个真实元素，初次渲染传入是vm.$el，这个el是真实的dom
    // 如果不是初次渲染而是更新视图的时候，vm.$el就被替换成了更新之前的老的虚拟dom
    console.log("patch=", oldVnode, vnode);
    const isRealElement = oldVnode.nodeType
    if (isRealElement) {
      // 这里是初次渲染的逻辑
      const oldElm = oldVnode;
      const parentElm = oldElm.parentNode;
      // 将虚拟dom转化成真实dom节点
      let el = createElm(vnode);
      console.log("parentElm=", oldElm,parentElm);
      // 插入到老的el节点下一个节点的前面 就相当于插入到老的el节点的后面
      // 这里不直接使用父元素appendChild 是为了不破坏替换的位置
      parentElm.insertBefore(el, oldElm.nextSibling);
      // 删除老的el节点
      parentElm.removeChild(oldVnode);
      console.log('el=',el)
      return el;
    }
}
// vnode转成真实dom，调用原生方法
function createElm(vnode){
    let {tag,data,key,children,text} = vnode;
    // 判断类型 是元素节点还是文本节点
    if(typeof tag === 'string') {
        // 虚拟dom的el 属性指向真实dom
        vnode.el = document.createElement(tag);
        //解析虚拟dom属性
        updateProperties(vnode);
        // 如果有子节点就递归插入到父节点里面
        children.forEach(child => {
            return vnode.el.appendChild(createElm(child))
        })
    } else {
        //文本节点
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
// 解析vnode的data属性 映射到真实dom上
function updateProperties(vnode) {
  let newProps = vnode.data || {};
  let el = vnode.el; //真实节点
  for (let key in newProps) {
    // style需要特殊处理下
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === "class") {
      el.className = newProps.class;
    } else {
      // 给这个元素添加属性 值就是对应的值
      el.setAttribute(key, newProps[key]);
    }
  }
}
