import { initMixin } from "./init"
import { lifecycleMiXin } from "./lifecycle/index";
import { renderMiXin } from "./vdom/index";
import {stateMiXin} from './initState'
 function Vue(options) {
    // console.log('Vue=',options)
    // 初始化
    this._init(options)
}
initMixin(Vue)
renderMiXin(Vue);//添加render函数
lifecycleMiXin(Vue);//添加生命周期
stateMiXin(Vue);// 添加方法
 export default Vue