import {observer} from './observe/index'
import {nextTick} from './util/nextTick'
export function initState(vm) {
    let opts = vm.$options
    // console.log('initState=',vm)
    if (opts.props) {
        initProps()
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.watch) {
      initWatch();
    }
    if (opts.computed) {
      initComputed();
    }
    if (opts.methods) {
      initMethods();
    }

}
function initData(vm){ // data 两种格式 对象 和 函数
    // console.log('initData',vm)
    let {data} = vm.$options
    data = vm._data = typeof data === 'function'? data.call(vm) : data
    // console.log("data", vm._data);
    // data 数据劫持
    observer(data)
    // 将data上所有属性代理到实例上
    for(let key in data){
      proxy(vm,'_data',key)
    }
}
function proxy(vm,source,key) {
  Object.defineProperty(vm,key,{
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}
function initProps(){}
function initWatch(){}
export function stateMiXin(Vue) {
  Vue.prototype.$nextTick = nextTick;
}
function initComputed(){}
function initMethods() {}