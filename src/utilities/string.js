/**
 * @typedef MDNameProps
 * @property {"BOLD"} BOLD
 * @property {"ITALIC"} ITALIC
 * @property {"UNDERLINE"} UNDERLINE
 * @property {"LINETHROUGH"} LINETHROUGH
 * @property {"HIGHLIGHT"} HIGHLIGHT
 * @property {"UNORDERED_LIST"} UNORDERED_LIST
 * @property {"ORDERED_LIST"} ORDERED_LIST
 * @property {"HEADING_0"} HEADING_0
 * @property {"HEADING_1"} HEADING_1
 * @property {"HEADING_2"} HEADING_2
 * @property {"HEADING_3"} HEADING_3
 * @property {"HEADING_4"} HEADING_4
 * @property {"HEADING_5"} HEADING_5
 * @property {"LINK"} LINK
 * @property {"IMAGE"} IMAGE
 */

export const MD_AS_STR = {
  BOLD: '\\*\\*([^\\*\\s]+[^\\*]+[^\\*\\s]+|[^\\*\\s]+)\\*\\*',
  ITALIC: '\\*([^\\*\\s]+[^\\*]+[^\\*\\s]+|[^\\*\\s]+)\\*',
  UNDERLINE: '~([^~\\s]+[^~]+[^~\\s]+|[^~\\s]+)~',
  LINETHROUGH: '~~([^~\\s]+[^~]+[^~\\s]+|[^~\\s]+)~~',
  HIGHLIGHT: '==([^=\\s]+[^=]+[^=\\s]+|[^=\\s]+)==',
  UNORDERED_LIST: '^-\\s(.+)$',
  ORDERED_LIST: '^[\\d\\w]+\\.\\s(.+)$',
  HEADING_0: '^#\\s(.*?)$',
  HEADING_1: '^##\\s(.*?)$',
  HEADING_2: '^###\\s(.*?)$',
  HEADING_3: '^####\\s(.*?)$',
  HEADING_4: '^#####\\s(.*?)$',
  HEADING_5: '^######\\s(.*?)$',
  IMAGE: '!\\[.*?\\]\\((.*?)\\)',
  LINK: '\\[.*?\\]\\((.*?)\\)'
}

const MD = (function() {
  /**
   * @type {keyof MD_AS_STR}
   */
  const keys = Object.keys(MD_AS_STR)
  /**
   * @type {{[key in keyof MDNameProps]: { DEFAULT: RegExp, G: RegExp, I: RegExp, M: RegExp, GM: RegExp }}}
   */
  const md = {}

  for (let key of keys) {
    md[key] = {
      DEFAULT: new RegExp(MD_AS_STR[key]),
      G: new RegExp(MD_AS_STR[key], 'g'),
      I: new RegExp(MD_AS_STR[key], 'i'),
      M: new RegExp(MD_AS_STR[key], 'm'),
      GM: new RegExp(MD_AS_STR[key], 'gm')
    }
  }
  return md
})()

/**
 *  Hàm này dùng để remove tất cả markdown ra khỏi chuỗi. Chỉ còn lại plain text.
 * @param {string} md chuỗi markdown
 * @returns {string}
 */
export function removeMDFromString(md) {
  if (!md) return ''
  let keys = Object.keys(MD)
  for (let key of keys) {
    md = md.replaceAll(MD[key].GM, (match, capture) => {
      if (key === 'IMAGE' || key === 'LINK') return ''
      return capture
    })
  }
  return md
}

/**
 * Hàm này dùng để lấy ra tất cả image trong `md` (Chuỗi markdown).
 * @param {string} md chuỗi markdown
 * @returns {Array<string>}
 */
export function getBase64PhotoInMD(md, isFullUrl = false) {
  let photos = []
  let matches = md.matchAll(MD.IMAGE.GM)
  matches = [...matches]
  matches.forEach(match => {
    let base64 = match[1]
    photos.push(base64)
  })
  return photos
}

/**
 * Hầm này dùng để replace base64 image trong `md` (Chuỗi markdown) với link ảnh đã được tải.
 * @param {string} md chuỗi markdown
 * @param {Array<string>} links một mảng bao gồm tất cả các đường link của ảnh được gửi về từ cloudinary.
 * @returns {string}
 */
export function replaceBase64PhotoWithLink(md, links) {
  let i = 0
  const completeContent = md.replaceAll(MD.IMAGE.G, (match) => {
    console.log('Match: ', match.substring(0, 100))
    let newValue = match.replace(MD.IMAGE.DEFAULT, `![](${links[i]})`)
    console.log('New value: ', newValue)
    i++
    return newValue
  })
  return completeContent
}