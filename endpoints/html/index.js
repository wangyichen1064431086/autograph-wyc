/* MARK:该Module简而言之就是：
1. 先执行extract.js的extract函数：从ig.ft.com/autograph这个html DOM中抓取数据，得到关于csv和svg信息的Object stats:
    stats = {
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
2. 将stats.csv写入public/config/csv-stats.json;
将stats.svg写入public/config/svg-stats.json
*/


const got = require('got');
const chalk = require('chalk');//在Terminal渲染样式的模块。
const uri = require('../../util/uri.js');
const extract = require('./extract.js');
const buildArtifacts = require('../../util/build-artifacts.js');
function extractStats(url=uri.index){//ES6语法：指定参数的默认值,此处uri.index为'http://ig.ft.com/autograph/',即英文版autograph的地址
    console.log(chalk.underline.cyan(`Fetching:${url}`));//打印出带下划线的蓝绿色的文字
    return got(url)//got是一个promise
        .then(res => {//res是上一个promise 的resolve的值
            return res.body;
        })
        .then(htmlBody => {//htmlBody是上一个promise resolve的值即res.body
            return extract(htmlBody);
             
        })
        .then(stats => {
            //stats即extract执行后返回的对象，该对象结构及详细说明参见extract.js
            console.log(chalk.red(`Total CSVs: ${stats.csv.length}`));
            console.log(chalk.red(`Total SVGs:${stats.svg.length}\n`));

            return Promise.all([
                buildArtifacts.saveCsvStats(stats.csv),
                //MARK:将stats.csv写入public/config/csv-stats.json
                buildArtifacts.saveSvgStats(stats.svg)
                //MARK:将stats.svg写入public/config/svg-stats.json
            ]);
        })
        .catch(err => {
            console.log(err);
        });
}

if (require.main == module) {
    extractStats()
        .catch(err => {
            console.log(err);
        })
}

module.exports = extractStats;