const acorn =  require('acorn')
const fs = require('fs')
const escodegen = require('escodegen')
const generate = require('@babel/generator').default
const parser = require('@babel/parser')
const path = require('path')
const Replace = require('./replace')

function removeConsole(expression){
  const caller = expression.callee
  console.log('removeConsole',caller.type)
  if(caller.body)
  {
    workNode(caller)
  }
  if(caller.callee)
  {
    removeConsole(caller) && delete expression.callee
  }
  if(caller.object&&caller.object.name === 'console')
  {
    return true
  }

}

function loop(node){
  if(node && node instanceof Array)
  {
    for( let itemIndex = 0;itemIndex< node.length; itemIndex++)
    {
      const item = node[itemIndex]
      console.log('item',item.type)
      if(item.body)
      {
        workNode(node[itemIndex])
      }
      if(item.cases)
      {
        workNode(node[itemIndex])
      }
      if(item.IfStatement)
      {
        workNode(node[itemIndex])
      }
      if(item.consequent)
      {
        workNode(node[itemIndex])
      }
      if(item.alternate)
      {
        workNode(node[itemIndex])
      }
      if(item.type === 'ReturnStatement'){
        workNode(node[itemIndex].argument)
      }
      if(item.type === 'Literal' || item.type === 'StringLiteral')
      {
        node[itemIndex].value = new Replace(item.value).startReplace(['console.info','console.log','console.error','console.warn'])
        node[itemIndex].extra.rawValue = new Replace(item.extra.rawValue).startReplace(['console.info','console.log','console.error','console.warn'])
        node[itemIndex].extra.raw = new Replace(item.extra.raw).startReplace(['console.info','console.log','console.error','console.warn'])
      }


      if(item.expression && item.expression.type === 'CallExpression' ){
        const expression = item.expression
        if(removeConsole(item.expression) && node.splice(itemIndex,1))
        {
          itemIndex = itemIndex - 1
        }
        if(expression.arguments && expression.arguments instanceof Array){
          workNode(expression)
        }
      }
      else if(item.expression && item.expression.type === 'FunctionExpression' ){
        const expression = item.expression
        if(expression.node){
          workNode(expression)
        }
      }
      
    }
  }
  else if(node){
    console.log('object',node.type)
    workNode(node)
  }
}



function workNode(ast){
  const loopProps = ['body','arguments','consequent','cases','IfStatement','alternate']
  for( var prop of loopProps)
  {
    ast[prop] && loop(ast[prop] )
  }
}

function main(ast){
  workNode(ast)
  return generate(ast).code
}
 function replace(sourceCode,conditions){

  const ast =  parser.parse(sourceCode,{
    sourceType: 'script',
    plugins:[
      'jsx',
      'flowComments'
    ],
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    allowImportExportEverywhere: true,
    allowSuperOutsideMethod: true,
    allowUndeclaredExports: true,
    strictMode: true
  }).program
  const res = main(ast)
  // fs.writeFileSync(path.join(__dirname,'./target.js'),res)
  return res
}
module.exports = replace


// test code
const sourceCode = fs.readFileSync(path.join(__dirname,'./source.js'),'utf-8')
fs.writeFileSync(path.join(__dirname,'./target.js'),replace(sourceCode))
// console.log(replace('console.log(fun())function A(){console.log(123)}console.log()//123213console.log(dasdadasdfunction(){a})'))