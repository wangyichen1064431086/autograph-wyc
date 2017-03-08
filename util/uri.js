//该模块就是提供了若干uri

const path = require('path');

module.exports = {
    index: 'http://ig.ft.com/autograph/',//英文版autograph的地址
    ofCsv:function (filename) {
        return `${this.index}data/${filename}`;//即http://ig.ft.com/autograph/data/${filename}
    },
    get svgConfig() {
        /*get 语句作为函数绑定在对象的属性上，当访问该属性时调用该函数，即调用时通过 thisobj.svgConfig得到值
        */
        return `${this.index}config/nightingale-config.json`;
        //即http://ig.ft.com/autograph/config/nightingale-config.json
        //不明白这里使用get的必要性在哪里？？？
    },

    chartScss: path.resolve(__dirname,'../client/chart-styles.scss'),
    //此处__dirname是当前文件所在目录
    mainScss: path.resolve(__dirname,'../client/main.scss')
}