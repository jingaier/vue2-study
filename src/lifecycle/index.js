import Watcher from '../observe/watcher';
import {patch} from '../vdom/patch'
export function mountComponent(vm,el){
  // 在上一步 模板解析 生成了render渲染函数
  // 下一步就是通过_render()方法，调用render函数，生成虚拟dom，再用_update将vnode 变成真实的DOM
  vm.$el = el; // 真实的el赋值给实例的$el属性上，为下一步虚拟dom产生的新的dom替换老的dom做铺垫
  let updateComponent = () => {
    // vm._render 将render函数变成虚拟dom,vm._update将vnode 变成真实的DOM
    vm._update(vm._render()); // 进行实例挂载
  };
  // 引入watcher的概念 这里注册一个渲染watcher 执行vm._update(vm._render())方法渲染视图
  new Watcher(vm, updateComponent, null, true);
}

export function lifecycleMiXin(Vue){
    Vue.prototype._update = function(vnode){
        const vm = this
        //vnode 到真实dom 的核心方法
        vm.$el = patch(vm.$el,vnode)
    }
}