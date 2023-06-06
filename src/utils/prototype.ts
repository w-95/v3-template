/**
 * 扩展Array、Date、String 原型上方法
 * @param { Number } num 几年 或者几月 
 * @param { String } dateName 支持【day, year, month】
 * @param { Date } startTime 开始时间
 * @returns 
 */
Date.prototype.Format = function (fmt: string) {
    var o:any = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

Array.prototype.Contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

Array.prototype.Distinct = function () {
    var arr = new Array();
    var i = this.length;
    while (i--) {
        if (!arr.Contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}

Array.prototype.Remove = function (idx) {
    var arr = [];
    for (let i = 0; i < this.length; i++) {
        if (i != idx) {
            arr.push(this[i])
        }
    }
    return arr
}

String.prototype.Trim = function () {

    return this.replace(/\s+/g, "");

};

// module.exports = String.prototype.Trim;

// module.exports = Date.prototype.Format;
// module.exports = Array.prototype.Contains;
// module.exports = Array.prototype.Remove;
