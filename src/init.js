import {initState} from './initState'
import { compileToFunction } from './compile/index.js';
import { mountComponent } from './lifecycle/index.js';
export function initMixin (Vue)  {
    Vue.prototype._init = function (options) {
      // console.log("_init", options);
      let vm = this
      vm.$options = options
      //初始化状态
      initState(vm)
      if(vm.$options.el){
        vm.$mount(vm.$options.el);
      }
    };
    Vue.prototype.$mount = function ($el) {
      // console.log("$mount", $el);
      let vm = this;
      let el = document.querySelector($el)
      vm.$el = el
      let options = vm.$options;
      if(!options.render){// 如果没有render
        let template = options.template
        if(!template && el){
          //获取HTML
          template = el.outerHTML;
          
        }
        // 最终需要把tempalte模板转化成render函数
        if (template) {
          // ast 语法树
          let render = compileToFunction(template);
          // 将render 函数 变成vnode --> 再将vnode 变成 真实DOM 挂在到元素上
          options.render = render;
        }
      }
      debugger
      //将当前组件实例渲染到真的el
      return mountComponent(vm,el)
    };
}