import { MenuListT } from '@/interface/menu';

type parsedT = {
  [x: string]: any;
};

/**
 * 将一个&符号拼接的字符传解析成对象 例如 "username=xxxxx&password=123111"
 * @param url String 要解析的字符串
 * @returns
 */
export const parseQuery = (url: string): parsedT => {
  const [parsed, keyValuePairs] = [{}, url.split('&')];

  for (let i = 0; i < keyValuePairs.length; i++) {
    const [key, value] = keyValuePairs[i].split('=');
    (parsed as parsedT)[key] = value;
  }

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
  const color = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - color.length) + color;
};

/**
 * 给定指定颜色 返回其相反的颜色
 * @param color
 * @returns
 */
export const getContrastingColor = (color: string) => {
  // 移除颜色字符串前面的 '#' 符号
  color = color.replace('#', '');

  // 将颜色转换为 RGB 形式
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  // 计算相反的颜色
  const contrastR = 255 - r;
  const contrastG = 255 - g;
  const contrastB = 255 - b;

  // 将相反颜色转换为十六进制形式
  const contrastColor =
    '#' + componentToHex(contrastR) + componentToHex(contrastG) + componentToHex(contrastB);

  return contrastColor;
};

// 辅助函数：将十进制数字转换为两位的十六进制字符串
const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};

// 添加侧边栏对应的中英文的key
export const resetRouterLeft = (routers: MenuListT) => {
  if (!Array.isArray(routers)) {
    return [];
  }

  return (routers as Array<MenuListT[]>).map((item: any) => {
    if (item.child) {
      item.child = resetRouterLeft(item.child);
    };

    switch (item.name) {
      case '产品管理':
        item.lang = 'prodMgmt';
        break;
      case '消毒机器人':
        item.lang = 'disRobot';
        break;
      case '配送机器人':
        item.lang = 'DR';
        break;
      case '版本管理':
        item.lang = 'versionC';
        break;
      case '客户管理':
        item.lang = 'CRM';
        break;
      case '用户中心':
        item.lang = 'UC';
        break;
      case '产品列表':
        item.lang = 'pordList';
        break;
      case '日志抓取记录':
        item.lang = 'logRecords';
        break;
      case '定制资源':
        item.lang = 'customRes';
        break;
      case '设备列表':
        item.lang = 'devList';
        break;
      case '定时任务统计':
        item.lang = 'STS';
        break;
      case '预警消息':
        item.lang = 'WM';
        break;
      case '订单配送统计':
        item.lang = 'ODS';
        break;
      case '帮取送列表':
        item.lang = 'HDL';
        break;

      case '预警消息':
        item.lang = 'WM';
        break;
      case '基础数据':
        item.lang = 'MD';
        break;
      case '呼叫列表':
        item.lang = 'callList';
        break;
      case '异常统计':
        item.lang = 'AS';
        break;
      case '版本列表':
        item.lang = 'vList';
        break;
      case '客户列表':
        item.lang = 'CustomerList';
        break;
      case '个人中心':
        item.lang = 'privacy';
        break;
      default:
        break;
    };
    return item;
  });
};
