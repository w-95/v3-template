
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