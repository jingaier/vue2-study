import {parseHTML} from './parse.js'
import {generate} from './generate.js'
export function compileToFunction(el){
    // console.log('complieToFunction',el)
    // let template = el.template
    // 1、将HTML变成AST语法树
    let ast = parseHTML(el)
    // 2、 ast语法树-> render函数(字符串 -> 函数)
    // console.log('ast--=',ast)
    let code = generate(ast)
    // 将字符串 变成 render函数
    let render = new Function(`with(this){return ${code}}`)
    // console.log('render函数',render)
    return render
}