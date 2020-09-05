import { Message } from 'element-ui'

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
