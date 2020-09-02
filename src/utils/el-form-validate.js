import { validPI } from './validate'

export function validElPI(rule,value,callback){
  if(!validPI(value)){
    callback(new Error('请填写正整数'))
  }else{
    callback()
  }
}
