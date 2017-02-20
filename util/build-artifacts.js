const fs = require('fs-jetpack');//比node自带fs要更好的fs system API
const loadJsonFile = require('load-json-file');//Read and parse a JSON file
const writeJsonFile = require('write-json-file');//Stringify and write JSON to a file atomically
const path = require('path');
const slug = require('speakingurl');//翻译工具
const filesize = require('filesize');//JavaScript library to generate a human readable String describing the file size

const uri = require('./uri.js');

const publicDir = path.resolve(__dirname,'../public');
const glossaryDir = path.resolve(__dirname,'../glossary');

const graphicsDir = `${publicDir}/graphics`;
const dataDir = `${publicDir}/data`;
const configDir = `${publicDir}/config`;
const cssDir = `${publicDir}/styles`;

const csvStatsFile = `${configDir}/csv-stats.json`;
const svgStatsFile = `${configDir}/svg-stats.json`;
const svgConfigFile = `${configDir}/${path.basename(uri.svgConfig)}`;
const glossaryFile = `${glossaryDir}/en-cn.json`;

function humanReadableSize(str){
    const size = Buffer.byteLength(str);//Buffer：node核心class，Buffer.byteLength(string)--返回字符串的byte数目
    return filesize(size,{round:0});//将byte数目以人类可读的方式展现出来，即进行单位转换，eg:filesize(265318, {round: 0});// "259 KB" 
    /*
        round:小数位数
    */
}

module.exports = {
 // return an object containing svg's filename and its size.
    saveSvg: function(name, svgString){
        // 写入svg文件: 将svgString写入name文件

        const filename = `${slug(name)}.svg`;//将字符串name翻译为英语
        const dest = `${graphicsDir}/${filename}`;//即public/graphics/${filename}
        console.log(`Saving SVG:${filename}`);
        return fs.writeAsync(dest,svgString,'utf8')//就是将svg数据(svgString)写入public/graphics/${filename}文件
        //此处用的是 fs-jetpack的异步方法，故返回的是promise,后面可以继续then()
        .then(() => {
            return {
                name: filename,
                size: humanReadableSize(svgString)
            };
        });
    }, 
    
    getSvgConfig: function(){
        // 读取文件public/config/svg-stats.json的数据为object

        return loadJsonFile(svgConfigFile);//Returns a promise for the parsed JSON.
    },

    saveSvgConfig: function(json){
        // 将json写入public/config/svg-stats.json

        console.log(`Saving svg config:${svgConfigFile}`);//即public/config/svg-stats.json
        return writeJsonFile(svgConfigFile,json)
        .then(() => {
            return json;
        });
    },

    saveCsv: function(filename, csvString){
        //写入文件：将csvString写入到public/data/${filename},并返回csvString的可读的大小

        const dest = `${dataDir}/${filename}`;//即public/data/${filename}
        console.log(`Saving:${dest}`);
        return fs.writeAsync(dest,csvString,'utf8')
            .then(() => {
                return humanReadableSize(csvString);
            });
    },

    saveCsvStats: function(json) {
        //写入文件：将json写入public/config/csv-stats.json

        console.log(`Saving csv stats:${csvStatsFile}`);//即public/config/csv-stats.json
        return writeJsonFile(csvStatsFile,json);
    },

    getCsvStats: function() {
        //读取文件数据：读取public/config/csv-stats.json

        console.log(`Loading ${csvStatsFile}`);//即public/config/csv-stats.json
        return loadJsonFile(csvStatsFile);
    },

    saveGlossary: function(json) {
        //写入文件:将json写入到glossary/en-cn.json

        return writeJsonFile(glossaryFile,json);//即glossary/en-cn.json
    },

    getGlossary: function(){
        //读取文件数据：读取glossary/en-cn.json的数据为object

        return loadJsonFile(glossaryFile)
        .catch(err => {
            return {};// If the file does not exists, return an empty object.
        });
    },

    saveStyles: function(name, result) {
        //写入文件：将result.css,result.map分别写入public/styles/${name}.css，public/styles/${name}.css.map

        const filename = `${cssDir}/${name}.css`;//即public/styles/${name}.css
        console.log(`Saving styles ${filename}`);
        return Promise.all([
            fs.writeAsync(filename, result.css,'utf8'),
            fs.writeAsync(`${filename}.map`,result.map,'utf8')
        ])
    },

    saveTemp: function(filename, content){
        //写入文件：将content写入到.tmp/${filename}

        return fs.writeAsync(`${path.resolve(__dirname,'../.tmp')}/${filename}`,content,'utf8');
    }

}


