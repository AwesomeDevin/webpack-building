
class Replace{
  constructor(str,condition){
      this.leftStack = []
      this.rightStack = []
      this.str = Buffer.from(str)
      // this.str = str
      this.count = 0;
      this.standard = 10;
      this.regexStr = '';
      this.orIndex = 0;
  }
  matchLeftBracket(conditionArr){
      let leftStack = this.leftStack
      let rightStack = this.rightStack
      let condition
      let conditionMatch = this.str.toString().match(this.regexStr)
      
      if(this.regexStr.length<1)
      {
          return -1
      }
      else if(conditionMatch&&conditionMatch.length>0)
      {
          condition = conditionMatch[this.orIndex]
      }
      else
      {
        return -1
      }
      
      if(leftStack.length==1)
      {
          return this.str.toString().indexOf('(',leftStack[leftStack.length-1]+condition.length+3)
      }
      if(leftStack.length>0)
      {
          return this.str.toString().indexOf('(',leftStack[leftStack.length-1]+1)
      }
      const index =  this.str.toString().indexOf(condition+'(',this.orIndex)
      if(this.str.toString().charAt(index-2) == '|' || this.str.toString().charAt(index-2) == '&')
      {
         this.orIndex += 1
         return this.matchLeftBracket(conditionArr)
      }
      
      this.orIndex = 0;
      return index
  }
  getRegex(conditionArr){
      var str = ''
      if(conditionArr.length<1)
      {
          return str
      }
    for(var index in conditionArr)
    {
      if(index == 0){
        str += conditionArr[index]
      }
      else
      {
        str = str + '|' + conditionArr[index]
      }
    }
    return new RegExp(str,'g')
  }
  matchRightBracket(){
      let leftStack = this.leftStack
      let rightStack = this.rightStack
      
      if(rightStack.length>0)
      {
          return this.str.toString().indexOf(')',rightStack[rightStack.length-1]+1)
      }
      const index = leftStack[leftStack.length-1]?leftStack[leftStack.length-1]:0
      return this.str.toString().indexOf(')',index+1)
  }
  toRecursive(conditionArr,cb){
      this.count++;
      // if(this.count>=this.standard)   //添加nextTick 进行异步处理，节省内存
      // {
      //     this.count = 0;
      //     return process.nextTick(()=>{
      //         return this.toReplace(conditionArr,cb)
      //     })
      // }
      // else
      // {
      //     return this.toReplace(conditionArr,cb)
      // }
      return this.toReplace(conditionArr,cb)
  }
  toReplace(conditionArr,cb){
          let leftStack = this.leftStack
          let rightStack = this.rightStack
          let startIndex,endIndex
          startIndex = this.matchLeftBracket(conditionArr)
          endIndex = this.matchRightBracket()
          if(this.str.toString().length<1)
          {
              return this.str.toString()
          }
          if(leftStack.length>0&&rightStack.length===leftStack.length)
          {
              var strArr = this.str.toString().split('')
              strArr.splice(leftStack[0],rightStack[rightStack.length-1]-leftStack[0]+1)
              this.str = Buffer.from(strArr.join(''))
              this.leftStack = []
              this.rightStack = []
              return this.toRecursive(conditionArr,cb)
          }
          
          // console.log(this.str.toString(),startIndex,endIndex,leftStack,rightStack)
          if(startIndex>=0&&leftStack.length<1)
          {
              leftStack.push(startIndex)
          }
          else if(startIndex>=0&&startIndex<=endIndex)
          {
              leftStack.push(startIndex)
          }
          else if(endIndex>=0 &&leftStack.length>0)
          {
              rightStack.push(endIndex)
          }
          else if(startIndex<0&&leftStack.length<1&&rightStack.length<1){
              cb&&cb(this.str.toString())
              return this.str.toString()
          }
          return this.toRecursive(conditionArr,cb)
  }
  startReplace(conditionArr,cb){
    this.regexStr = this.getRegex(conditionArr)
    return this.toReplace(conditionArr,cb)
  }
  
}

// const str = "\n\nvar _react = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactDom = __webpack_require__(/*! react-dom */ \"./node_modules/react-dom/index.js\");\n\nvar _greeter = __webpack_require__(/*! ./greeter */ \"./src/greeter.js\");\n\nvar _greeter2 = _interopRequireDefault(_greeter);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log(document.getElementById('root')); // window.onload=function(){\n// \tconst greeter = require('./greeter.js');\n// \t\n// \tdocument.getElementById(\"root\").appendChild(greeter());\n// }\n\nconsole.info(document.getElementById('root'));\nconsole.error(document.getElementById('root'));\nconsole.warn(document.getElementById('root'));\n\n(0, _reactDom.render)(_react2.default.createElement(_greeter2.default, null), document.getElementById('root'));\n\n//# sourceURL=webpack:///./src/index.js?"

// console.log(new Replace(str).startReplace(['console.info','console.log','console.error','console.warn']))
// new Replace('dsad||console.log(fun())function A(){console.info(123)}console.error()//123213console.warn(dasdadasdfunction(){a})').startReplace(['console.info','console.log','console.error','console.warn'],(res)=>{
//     console.log(res)
// })   //test
module.exports = Replace