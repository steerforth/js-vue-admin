/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {Object} str
 */
export function validPhone(str) {
  return (/^1(3|4|5|6|7|8|9)\d{9}$/).test(str)
}
