//MARK:该module的作用简而言之就是提供了一个函数translate，用于输出词汇表中英文的对应中文。

const glossary = require('../glossary/en-cn.json');//英中词汇表，是由翻译人工翻译的？？

function translate (source) {
    if (!glossary.hasOwnProperty(source)) {
            /// hasOwnProperty()方法返回一个布尔值，其用来判断某个对象是否含有指定的属性。用来检测一个对象是否含有特定的自身属性；和 in 运算符不同，该方法会忽略掉那些从原型链上继承到的属性。
        return source;
    }
    return glossary[source] ? glossary[source] : source;
}

if (require.main == module) {
    console.log(translate('UK GDP growth'));
    console.log(translate('% change previous quarter'));
    console.log(translate('€ per £'));
    /// 这块相当于测试文件吧？？？
}

module.exports = translate;