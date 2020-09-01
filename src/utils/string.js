export function getFileExtensions(filename) {
  return filename.substring(filename.lastIndexOf("."),filename.length)
}
