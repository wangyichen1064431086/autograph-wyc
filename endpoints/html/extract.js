/* MARK:该模块简而言之就是从ig.ft.com/autograph这个html DOM（views/index.html这个DOM结构类似）中抓取数据，得到以下Object数据：
   {
        csv: csvStats,
            //csvStats是个数组，每个item为 {
                 "name": csvName,
                 "size":size.trim(),
                 "lastModified":lastModified
            }

        svg: svgStats
            //svgStats是个数组，每个item为 {
                 name:svgName,
                 size:"",
                 lastModified:lastModified
            }
    }
*/


const cheerio = require('cheerio');//一个jQuery核心实现，可以将HTML告诉服务器
const path = require('path');

function extract(html){
    /** 根据index.html上的内容，得到一个
     * @param {string} html - Contents scraped from ig.ft.com/autograph
     * @returns {object}
    */

    const $ = cheerio.load(html);//将某html元素获取为$
    const rowEls = $('table.datasets').children('tr');//获取datasets表的所有tr
    const chartEls = $('div.charts').children(' chart');//获取charts版块的所有class为chart的div

    const csvStats = rowEls.map((index, element) => {
        //MARK:根据ig.ft.com/autograph这个html的table内容，得到一个数组csvStats，该数组每个item都是一个对象，该对象具有属性name、size、lastModified,分别描述了这些csv文件的信息（名称、大小、最后更新时间）

        /*注意：此处的map是jQuery的API，其回调函数的参数分别为(index,element),
          和Array.prototype.map的参数顺序正好相反，其参数是(item,index)
        */
        const tdEls = $(element).children('td');//获取tr下的所有td(这里每个tr下有两个td)
        const firstTdEl = tdEls.eq(0);//获取tr下的第一个td
        const csvName = firstTdEl.children('a').text();//获取第一个td下的a的内容
        const size = firstTdEl
            .clone()//对第一个td元素进行深复制（即其上的事件监听函数也被复制
            .children()//获取其下所有子元素，这里就是a
            .remove()//移除了a
            .end()//结束最近的一次过滤操作，返回匹配元素（End the most recent filtering operation in the current chain and return the set of matched elements to its previous state.）
            .text();//返回移除了a后剩下的内容，即 {{csv.size}}
        const lastModified = tdEls.eq(1).text();//获取第二个td的内容，即 {{csv.lastModified}}
        return {
            //最后得到的就是以这种对象为item的一个数组
            "name": csvName,
            "size":size.trim(),
            "lastModified":lastModified
        }
    }).get();
    /*.get():Without a parameter, .get() returns an array of all of the elements:
    * 疑问：这里有必要用get()么，之前又不是elements就是普通的对象组成的数组
    */

    const svgStats = chartEls.map((index, element) => {
        //MARK:根据ig.ft.com/autograph这个html的所有class为"chart"的div的内容，得到一个数组svgStats，该数组每个item都是一个对象，该对象具有属性name、size、lastModified,分别描述了这些csv文件的信息（名称、大小、最后更新时间）

       
        const svgUrl = $(element).children('object').attr('data');//获取每个class为chart的div下的object的属性data的值，即为"graphics/{{chart.name}}"
        const svgName = path.basename(svgUrl);//即{{chart.name}}
        const lastModified = $(element).children('p').eq(0).children('small').eq(0).text();//即 {{chart.lastModified}}

        return {
            name:svgName,
            size:"",
            lastModified:lastModified
        }
    }).get();

    return {
        csv: csvStats,
        svg: svgStats
    }


}

module.exports = extract;
