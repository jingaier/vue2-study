import {ArrayMethods} from './array'
import Dep from './dep'
export function observer(data) {
    // console.log('observer',data)
    // 对象
    // if(typeof data != 'object' || data == null) return data
    // return new Observer(data)
    if (
      Object.prototype.toString.call(data) === "[object Object]" ||
      Array.isArray(data)
    ) {
      return new Observer(data);
    }
    // 数组
}
class Observer {
    constructor(value){
        // 判断是对象还是数组
        if (Array.isArray(value)){
            // console.log('数组',value)
            // 是数组，就指向重写后的数组（不像对象一样遍历去劫持了，提高性能）
            value.__proto__ = ArrayMethods;
            // 对数组里对象劫持
            // console.log('zheli=',value)
            this.observeArray(value)
        } else {
            this.init(value)
        }
        //对数组原型重写之前咱们先要理解这段代码 这段代码的意思就是给每个响应式数据增加了一个不可枚举的__ob__属性 并且指向了 Observer 实例 那么我们首先可以根据这个属性来防止已经被响应式观察的数据反复被观测 其次 响应式数据可以使用__ob__来获取 Observer 实例的相关方法 这对数组很关键
        this.dep = new Dep()
        // 观测值
        Object.defineProperty(value,'__ob__',{
            //指代的就是Observer实例
            value: this,
            enumerable: false,
            writable: true,
            configurable: true
        })
    }
    init(data) {
        let keys = Object.keys(data)
        for (let i=0; i<keys.length; i++){
            // 对对象里每一个属性进行劫持
            let key = keys[i]
            let value = data[key]
            defineReactive(data,key,value)
        }
    }
    observeArray(data){
        // 数组遍历每一个item
        for(let i=0;i<data.length;i++){
            observer(data[i]);
        }
    }
}
// 对对象属性进行劫持
function defineReactive(data,key, value){
    // observer(value)// 在这里深度递归（有点绕，思考思考）--> 优化成 let childOb = observer(value) childOb 就是Observer的实例
    let childOb = observer(value)
    let dep = new Dep() // 为每个属性实例化一个dep
    Object.defineProperty(data,key,{
        get() {
          // 依赖收集-页面取值的时候，把watcher收集到dep里面
          // 渲染 Watcher 放到 dep 的 subs 数组里面 同时把 dep 实例对象也放到渲染 Watcher 里面去
          if (Dep.target) {
            dep.depend(); // 如果有watcher，dep就保存watcher，watcher也会保存dep
            console.log(childOb,'childOb')
            if(typeof childOb === 'object'){
                // 这里表示 属性的值依然是一个对象 包含数组和对象 childOb指代的就是Observer实例对象  里面的dep进行依赖收集
                // 比如{a:[1,2,3]} 属性a对应的值是一个数组 观测数组的返回值就是对应数组的Observer实例对象
                childOb.dep.depend() 
                // 如果数据结构类似 {a:[1,2,[3,4,[5,6]]]} 这种数组多层嵌套  数组包含数组的情况  那么我们访问a的时候 只是对第一层的数组进行了依赖收集 里面的数组因为没访问到  所以五大收集依赖  但是如果我们改变了a里面的第二层数组的值  是需要更新页面的  所以需要对数组递归进行依赖收集
                if (Array.isArray(value)) {
                    // 如果内部还是数组
                    dependArray(value); // 不停的进行依赖收集
                }           
            }
          }
          // console.log('获取劫持')
          return value;
        },
        set(newValue) {
            // console.log('设置')
            if(newValue === value) return ;
            childOb = observer(newValue);// 前提是对象，且对后来修改的属性设置劫持
            // observer(newValue);
            value = newValue
            dep.notify()//派发更新-通知watcher渲染 更新
        }
    })
}
function dependArray(value){
    for(let e,i=0,l=value.length;i<l;i++){
      e = value[i];
      // e.__ob__代表e已经被响应式观测了 但是没有收集依赖 所以把他们收集到自己的Observer实例的dep里面
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        // 如果数组里面还有数组  就递归去收集依赖
        dependArray(e);
      }
    }
}
/*对象
Object.defineProperty 
遍历对象
递归 get set
*/