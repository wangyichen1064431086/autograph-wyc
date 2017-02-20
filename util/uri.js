const path = require('path');

module.exports = {
    index: 'http://ig.ft.com/autograph/',//英文版autograph的地址

    ofCsv: function(filename){
        // 返回 http://ig.ft.com/autograph/data/${filename}
        return `${this.index}data/${filename}`;
    },

    get svgConfig() {
        /*get 语句作为函数绑定在对象的属性上，当访问该属性时调用该函数，即调用时通过 thisobj.svgConfig得到值
        */
        return `${this.index}config/nightingale-config.json`
    },

    chartScss: path.resolve(__dirname,'../client/chart-styles.scss'),
    mainScss: path.resolve(__dirname,'../client/main.scss')
}