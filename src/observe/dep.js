import Watcher from "./watcher";

// dep和watcher是多对多的关系，每个属性都有自己的watcher
let id = 0;// 全局，dep实例的唯一标识
export default class Dep {
    constructor(){
        this.id = id++;//自增
        this.subs = [];//存放watcher
    }
    depend(){
        //如果当前存在watcher
        if(Dep.target) {
            Dep.target.addDep(this)// 把自身dep实例放在watcher里面
        }
    }
    notify(){
        // 依次执行subs里面的watcher更新方法
        debugger
        this.subs.forEach(watcher => watcher.update())
    }
    addSub(watcher){
        debugger;
        //把watcher添加到自身的subs容器
        this.subs.push(watcher)
    }
}
Dep.target = null;// Dep.target 是一个全局Watcher 指向初始状态为null
//注：Dep是一个构造函数 可以理解为观察者模式里面的被观察者，在subs里收集watcher 当数据变动时通知自身subs所有的watcher更新
const targetStack = []//栈结构用来存放watcher

export function pushTarget(watcher){
    targetStack.push(watcher)
    Dep.target = watcher//Dep.target指向当前的watcher
}
export function popTarget(){
    targetStack.pop()// 当前watcher出栈，拿到上一个watcher
    Dep.target = targetStack[targetStack.length-1]
}