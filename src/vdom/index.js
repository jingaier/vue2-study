export function renderMiXin(Vue) {
  Vue.prototype._c = function (...args) {
    //元素
    // 创建生成虚拟标签
    return createElement(...args);
  };
  Vue.prototype._v = function (text) {
    //生成虚拟文本
    return createText(text);
  };
  Vue.prototype._s = function (val) {
    //生成虚拟变量
    return val == null
      ? ""
      : typeof val == "object"
      ? JSON.stringify(val)
      : val;
  };
  Vue.prototype._render = function () {
    let vm = this;
    // 获取模板编译生成的render方法
    let render = vm.$options.render;
    // 生成虚拟dom
    let vnode = render.call(vm);
    console.log("zheli-vnode", vnode);
    return vnode;
  };
}
// 创建元素vnode 等于render函数里面的 h=>h(App)
// function createElement(tag, data, key, children) {
//   return new Vnode(tag, data, key, children);
// }
function createElement(tag, data = {}, ...children) {
  let key = data.key;
  return new Vnode(tag, data, key, children);
}
// 创建文本vnode
function createText(text) {
  return new Vnode(undefined, undefined, undefined, undefined, text);
}
// 定义Vnode类
export default class Vnode {
  constructor(tag, data, key, children, text) {
    this.tag = tag;
    this.data = data;
    this.key = key;
    this.children = children;
    this.text = text;
  }
}
