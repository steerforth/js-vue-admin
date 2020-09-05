import { Message } from 'element-ui'
import { getFileExtensions, resolveFilenameFromHeader } from './string.js'

/**
 * 目前只处理xls,xlsx文件
 * @param {Object} params
 */
export function handlePreUpload(params){
  const file = params.file,
    fileName = file.name,
    isExcel = getFileExtensions(fileName).indexOf(".xls") != -1;
  if (!isExcel) {
    Message.error("只能上传excel格式.xls,.xlsx!")
    return
  }
  const form = new FormData()
  form.append("file", file)
  return form
}

export function handleFileDownload(res) {
  if (!res.data) {
    Message.warning("文件下载失败!")
    return
  }
  //异常结果返回的是json格式
  if (res.data.type.includes('application/json')) {
      let reader = new FileReader()
      reader.onload = function (event) {
        let message = JSON.parse(reader.result).errMsg // 错误信息
        Message.error(message)
      }
      reader.readAsText(res.data)
      return
  }

  //处理文件
  let fileName = resolveFilenameFromHeader(res.headers['content-disposition']);

  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(new Blob([res.data]), fileName)
  }else{
    let url = window.URL.createObjectURL(new Blob([res.data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url;
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
  }
}
