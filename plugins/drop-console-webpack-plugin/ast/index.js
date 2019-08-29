const acorn =  require('acorn')
const fs = require('fs')
const escodegen = require('escodegen')


function removeConsole(consoler){
  if(consoler.object.name === 'console')
  {
    return true
  }
}


function workNode(ast){
  let { body } = ast
  if(body && body instanceof Array)
  {
    for( let itemIndex = 0;itemIndex< body.length; itemIndex++)
    {
      const item = body[itemIndex]
      if(item.body)
      {
        workNode(item)
      }
      else if(item.expression && item.expression.type === 'CallExpression' ){
        removeConsole(item.expression.callee) && body.splice(itemIndex,1)
        itemIndex = itemIndex - 1
      }
      else if(item.type === 'ReturnStatement'){
        workNode(item.argument)
      }
    }
  }
  else if(body){
    workNode(body)
  }
}

function main(ast){
  workNode(ast)
  return escodegen.generate(ast)
}

function replace(sourceCode){
  const ast = acorn.parse(sourceCode)
  const res = main(ast)
  console.log(res)
  return res
}
module.exports = replace

// const sourceCode = fs.readFileSync('./source.js','utf-8')
// fs.writeFileSync('./target.js', replace(sourceCode) )

console.log(replace('console.log(fun())function A(){console.log(123)}console.log()//123213console.log(dasdadasdfunction(){a})'))