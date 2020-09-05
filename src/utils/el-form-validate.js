import { validPI,validPosNum } from './validate'

export function validElPI(rule,value,callback){
  if(!validPI(value)){
    callback(new Error('请填写正整数'))
  }else{
    callback()
  }
}

export function validElPosNum(rule,value,callback){
  if(!validPosNum(value)){
    callback(new Error('请填写正数'))
  }else{
    callback()
  }
}
