/* 字符串相关方法 */

/**
 * 字符串转为驼峰
 * toCamelCase('background-color'); // backgroundColor
 * toCamelCase('-webkit-scrollbar-thumb'); // WebkitScrollbarThumb
 * toCamelCase('_hello_world'); // HelloWorld
 * toCamelCase('hello_world'); // helloWorld
 */
export const toCamelCase = (str: string): string =>
  str.trim().replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))

/**
 * 首字母大写并驼峰
 * toPascalCase('hello world'); // 'HelloWorld'
 * toPascalCase('hello.world'); // 'HelloWorld'
 * toPascalCase('foo_bar-baz'); // FooBarBaz
 */
export const toPascalCase = (str: string): string =>
  (str.match(/[a-zA-Z0-9]+/g) || [])
    .map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join("")

/**
 * 第一个字符大写
 * firstUppercase('hello world'); // 'Hello world'
 */
export const firstUppercase = (str: string): string =>
  str[0].toUpperCase() + str.slice(1)

/**
 * 单词首字母大写
 * uppercaseWords('hello world'); // 'Hello World'
 */
export const uppercaseWords = (str: string): string =>
  str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase())

/**
 * -小写字母转大写
 * 输入: kebabToCamel('background-color')
 * 输出: 'backgroundColor'
 */
export const kebabToCamel = (str: string): string =>
  str.replace(/-./g, m => m.toUpperCase()[1])

/**
 * 大写驼峰转 -小写
 * 输入: camelToKebab('backgroundColor')
 * 输出: 'background-color'
 */
export const camelToKebab = (str: string): string =>
  str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()

/**
 * 传入文件路径 => 返回文件名、后缀名
 * 输入: 'http://domain.com/path/to/document.pdf')
 * 输出: {name: 'document', extension: 'pdf', fullName: 'document.pdf' }
 */
export const pathToFileType = (path: string) => {
  const arr = path.split(".")
  const extension =
    arr.length > 1 && /^[a-zA-Z0-9]+$/.test(arr.at(-1) || "") && arr.at(-1)
  const name = path.match(new RegExp(`[^/]+(?=.${extension}$)`))?.[0]
  return {
    name,
    extension,
    fullName: name + "." + extension,
  }
}

/**
 * 返回删除所有空格的字符串
 * removeSpaces('hel lo wor ld'); // 'helloworld'
 */
export const removeSpaces = (str: string): string => str.replace(/\s/g, "")

/**
 * 将 string 中带有 ${xx} 的字符替换为对象中的对应字段
 */
export const replace$key = (
  str: string,
  obj: { [prop: string]: any }
): string => {
  const matchList = str.match(/\${.+}/g)
  matchList?.forEach(i => {
    str = str.replace(i, obj[i.slice(2, -1)])
  })
  return str
}

/**
 * 获取 t('xxx') 或 $t(xxx) 括号内的字符
 * 输入: "t('test')" 输出: test
 * 输入: 't("test")' 输出: test
 * 输入: "$t('test')" 输出: test
 * 输入: '$t("test")' 输出: test
 */
export const getI18nKey = (str = ""): string | undefined => {
  if (
    /^(\$t\(|t\()/.test(str) && // "$t(" 或 "t(" 开头
    /\)$/.test(str) // ")" 结尾
  ) {
    let key = str.replace(/^(\$t\(|t\()/, "")
    key = key.replace(/\)$/, "")
    // 去除首尾 " '
    return key.replace(/(^'|^"|'$|"$)/g, "")
  }
}

/**
 * base64 编码
 * 输入: "12" 输出: MTI=
 */
export const base64Encode = (str: string) => {
  try {
    return Promise.resolve(btoa(unescape(encodeURIComponent(str))))
  } catch {
    return Promise.reject()
  }
}

/**
 * base64 解码
 * 输入: "MTI=" 输出: 12
 */
export const base64Decode = (utf8str: string) => {
  try {
    return Promise.resolve(decodeURIComponent(escape(atob(utf8str))))
  } catch {
    return Promise.reject()
  }
}

/**
 * 文件转 base64 编码
 * 输入: 任意文件 输出: base64 字符串
 */
export const file2Base64 = (file: File) =>
  new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = function (e) {
      // e.target.result就是该文件的完整Base64 Data-URI
      resolve(e.target?.result)
    }
    reader.readAsDataURL(file)
  })

/**
 * base64 编码转文件保存
 * 输入: base64字符，文件名 输出: 保存文件
 */
export const saveBase64ToFile = (base64Data: string, fileName: string) => {
  const base64 = base64Data.split(",")
  const byteCharacters = atob(base64[base64.length - 1])

  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)

  let fileType
  try {
    fileType = base64[0].split(":")[1].split(";")[0]
  } catch {}

  const blob = new Blob([byteArray], { type: fileType })

  // 创建一个链接并下载
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
}

/**
 * 获取文件类型 base64 编码的 mimetype 值
 * 输入: base64字符文件编码 输出: mimetype
 */
export const getBase64MimeType = (base64Data: string) => {
  try {
    return base64Data.split(",")[0].split(":")[1].split(";")[0]
  } catch {
    return
  }
}
