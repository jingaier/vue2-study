import { pushTarget, popTarget } from "./dep";
import {nextTick} from '../util/nextTick'
// 这里首先介绍 Vue 里面使用到的观察者模式 我们可以把 Watcher 当做观察者 它需要订阅数据的变动 当数据变动之后 通知它去执行某些方法 其实本质就是一个构造函数 初始化的时候会去执行 get 方法
let id = 0;//全局变量id 每次new watcher都会自增
export default class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb; //回调函数，比如在wacther更新之前可以执行beforeUpdate方法
    this.options = options; //额外的选项，true代表渲染watcher
    this.id = id++; //watcher的唯一标识
    this.deps = []; // 存放 dep的容器
    this.depsId = new Set(); //用来去重，保持dep不重复
    if (typeof exprOrFn === "function") {
      // 如果表达式是一个函数
      this.getter = exprOrFn;
    }
    this.get(); // 实例化就会默认调用get方法
  }
  get() {
    pushTarget(this); //在调用方法前先把当前watcher实例推到全局Dep.target上
    this.getter(); // 如果watcher是渲染watcher 那么就相当于执行vm._update(vm._render()) 这个方法在render函数执行的时候会取值，从而实现依赖收集
    popTarget(); // 在调用这个方法把当前的watcher实例从全局的Dep.target上移除
  }
  // 把dep放到deps里面，同时保证一个dep只被保存到watcher一次，同样的同一个watcher也只会保存在dep一次
  addDep(dep) {
    let id = dep.id;
    console.log("addDep=", dep, this.depsId, id);
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      //直接调用dep的addSub()方法，把自己（watcher)实例添加到dep的subs容器里
      dep.addSub(this);
    }
  }
  //
  update() {
    // this.get();
    queueWatcher(this)
  }
  run() {
    this.get();
  }
}
let queue = []
let has = {}
let pending = false
function queueWatcher(watcher){
    let id = watcher.id
    if(has[id] == undefined){
      // 去重
      //  同步代码执行 把全部的watcher都放到队列里面去
      queue.push(watcher); // 添加到列队里
      has[id] = true;
      // if(!pending){ // 防抖
      //     setTimeout(()=>{
      //         queue.forEach(item => item.run())
      //         queue = []
      //         has = {}
      //         pending = false
      //     },0)
      // }
      // pending = true

      // 进行异步调用
      nextTick(flushSchedulerQueue);
    }
}
function flushSchedulerQueue(){

  for (let i = 0; i < queue.length; i++) {
    queue[i].run();
  }
  // 执行完之后清空队列
  queue = [];
  has = {};
}