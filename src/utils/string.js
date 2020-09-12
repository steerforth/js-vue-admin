import { Message } from 'element-ui'

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 6 ? '清晨好' : (hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好'))))
}

export function getFileExtensions(filename) {
  return filename.substring(filename.lastIndexOf("."),filename.length)
}

/**
 *
 * @param {Object} disposition eg. attachment;filename=XXX.xlsx
 */
export function resolveFilenameFromHeader(disposition){
  if(!disposition){
    Message.error('响应头未找到Content-Disposition配置')
  }
  var filename = null;
  var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  var matches = filenameRegex.exec(disposition);
  if (matches != null && matches[1]) {
    filename = matches[1].replace(/['"]/g, '');
  }
  
  if(filename){
    //ISO-8859-1编码转换
    return decodeURIComponent(escape(filename))
  }
  return "未知";
  
}
