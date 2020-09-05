import { Message } from 'element-ui'
import { getFileExtensions, resolveFilenameFromHeader } from './string.js'

export function handleFileDownload(res) {
  if (!res.data) {
    Message.warning("文件下载失败!")
    return
  }
  
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