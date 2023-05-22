
type parsedT = {
    [x: string]: any
};

/**
 * 将一个&符号拼接的字符传解析成对象 例如 "username=xxxxx&password=123111"
 * @param url String 要解析的字符串
 * @returns 
 */
export const parseQuery = (url: string): parsedT => {
    const [parsed, keyValuePairs] = [ {}, url.split('&')];

    for (let i = 0; i < keyValuePairs.length; i++) {
      const [key, value] = keyValuePairs[i].split('=');
      (parsed as parsedT)[key] = value;
    };

    return parsed;
};

/**
 * 通过一个字符串生成一个颜色
 * @param str 
 * @returns string
 */
export const stringToColor = (str: string): string => {
  // 计算字符串的哈希值
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 生成颜色值
  const color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - color.length) + color;
};

/**
 * 给定指定颜色 返回其相反的颜色
 * @param color 
 * @returns 
 */
export const  getContrastingColor = (color: string) => {
  // 移除颜色字符串前面的 '#' 符号
  color = color.replace("#", "");

  // 将颜色转换为 RGB 形式
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  // 计算相反的颜色
  const contrastR = 255 - r;
  const contrastG = 255 - g;
  const contrastB = 255 - b;

  // 将相反颜色转换为十六进制形式
  const contrastColor = "#" + componentToHex(contrastR) + componentToHex(contrastG) + componentToHex(contrastB);

  return contrastColor;
}

// 辅助函数：将十进制数字转换为两位的十六进制字符串
const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}