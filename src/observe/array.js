/* 重写数组 */
// 1 获取原来的数组
let oldArrayProtoMethods = Array.prototype
// 继承
export let ArrayMethods = Object.create(oldArrayProtoMethods)
// 劫持 重写数组方法
let methods = ["push", "pop", "shift", "unshift", "splice", "reverse", "sort"];
methods.forEach(item => {
    ArrayMethods[item] = function (...args){
      let result = oldArrayProtoMethods[item].apply(this, args);
      // console.log("数组劫持1", item, args, this);
      // 这里this指的就是数据本身，比如数据是{a:[1,2,3]} 那么我们push(4) this 就是a ob 就是a.__ob__ 代表的是该数据已经被响应式观察了并指向Observer实例
      const ob = this.__ob__;
      // 在这里要处理一个情况（就是对数组修改，unshift,和 push({d:1}) 这时候，这个对象没有被劫持）
      let inserted;
      switch (item) {
        case "push":
          break;
        case "unshift":
          inserted = args;
          break;
        case "splice":
          inserted = args.slice(2);
          //splice 前俩个参数是被替换的位置和长度，第三个参数开始是新增的被插入的值。做响应式监听的时候，主要是为了对新增加的值做监听，所以拿到slice(2) 就拿到了新增加的数据项，执行ob.observeArray(inserted)就可以了
          // console.log("splice=", args, inserted);
          break;
      }
      // 如果 有新增的元素inserted 是一个数组，调用Observer实例的observeArray对数组的每一项进行观测
      if (inserted) ob.observeArray(inserted);
      // 之后还可在这里检测到数组变化以后从而触发视图更新操作
      ob.dep.notify(); //数组派发更新 ob指的就是数组对应的Observer实例 我们在get的时候判断如果属性的值还是对象那么就在Observer实例的dep收集依赖 所以这里是一一对应的  可以直接更新
      return result;
    }
})