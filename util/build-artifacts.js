const fs = require('fs-jetpack');//比node自带fs要更好的fs system API
const loadJsonFile = require('load-json-file');//Read and parse a JSON file
const writeJsonFile = require('write-json-file');//Stringify and write JSON to a file atomically
const path = require('path');
const slug = require('speakingurl');//翻译工具
const filesize = require('filesize');//JavaScript library to generate a human readable String describing the file size

const uri = require('./uri.js');

const publicDir = path.resolve(process.cwd(),process.env.PUBLIC_DIR ? process.env.PUBLIC_DIR : 'public');
//思想性问题：为什么这里要想到用process.env对象？？
const glossaryDir = path.resolve(process.cwd(),'glossary');

const graphicsDir = `${publicDir}/graphics`;
const dataDir = `${publicDir}/data`;
const configDir = `${publicDir}/config`;
const cssDir = `${publicDir}/styles`;

const csvStatsFile = `${configDir}/csv-stats.json`;
const svgStatsFile = `${configDir}/svg-stats.json`;
const svgConfigFile = `${configDir}/${path.basename(uri.svgConfig)}`;//uri.svgConfig为http://ig.ft.com/autograph/config/nightingale-config.json
//得到public/config/nightingale-config.json

const glossaryFile = `${glossaryDir}/en-cn.json`;//词汇表


module.exports = {
 // Handle svg files.

    getSvgConfig: function(){
        // 读取数据：从public/config/nightingale-config.json读取并解析json数据

        return loadJsonFile(svgConfigFile);//Returns a promise for the parsed JSON.
    },

    saveSvgConfig: function(json){
        // 写入数据：将json写入public/config/nightingale-config.json

        console.log(`Saving svg config:${svgConfigFile}`);//即public/config/svg-stats.json
        return writeJsonFile(svgConfigFile,json);
    },

    // Save a single svg
    /*
    * @param {String} name - White space separated string. Pased from nightingale-config.json. You need to slugify it.
    */

    saveSvg: function(name, svgString){
        // 写入数据: 将svgString写入public/graphics/${slug(name)}.svg

        const filename = `${slug(name)}.svg`;//将字符串name翻译为英语
        const dest = `${graphicsDir}/${filename}`;//即public/graphics/${filename}
        console.log(`Saving SVG:${filename}`);
        return fs.writeAsync(dest,svgString,'utf8');//就是将svg数据(svgString)写入public/graphics/${filename}文件
        //此处用的是 fs-jetpack的异步方法，故返回的是promise,后面可以继续then()
    }, 
    
    getSvgSize: function(filename) {
        return fs.inspectAsync(`${graphicsDir}/${filename}`)
        .then(stat => {
       //获取public/graphics/${filename}文件的大小

        //fs.inspectAsync返回的是一个obj包含了文件的各种信息，其中obj.size是文件大小。
        //If file does not exist, stat === undefined.
        // Then throw the error to be catched by the next step.
            return filesize(stat.size,{round:0})
        })
        .catch(err => {
            throw err;
        });
    },

    saveSvgStats: function(json) {
        //写入数据：将数据json写入public/config/svg-stats.json
        console.log(`Saving SVG stats:${svgStatsFile}`);
        return writeJsonFile(svgStatsFile,json)
            .catch(err => {
                throw err;
            });
    },
    getSvgStats: function() {
        //读取数据：从public/config/svg-stats.json读取并解析json数据
        console.log(`Loading ${svgStatsFile}`);
        return loadJsonFile(svgStatsFile);
    },

// Handle csv files
    saveCsv: function(filename, csvString){
        //写入数据：将csvString写入到public/data/${filename}

        const dest = `${dataDir}/${filename}`;//即public/data/${filename}
        console.log(`Saving:${dest}`);
        return fs.writeAsync(dest,csvString);
    },

    saveCsvStats: function(json) {
        //写入数据：将json写入public/config/csv-stats.json

        console.log(`Saving csv stats:${csvStatsFile}`);//即public/config/csv-stats.json
        return writeJsonFile(csvStatsFile,json);
        
    },

    getCsvStats: function() {
        //读取数据：从public/config/csv-stats.json读取并解析json数据

        console.log(`Loading ${csvStatsFile}`);//即public/config/csv-stats.json
        return loadJsonFile(csvStatsFile);
        //loadJsonFile:Returns a promise for the parsed JSON.
    },

// Handle glossary
    saveGlossary: function(json) {
        //写入数据:将json写入到glossary/en-cn.json

        return writeJsonFile(glossaryFile,json);
    },

    getGlossary: function(){
        //读取数据：从glossary/en-cn.json读取并解析json数据

        return loadJsonFile(glossaryFile)
        .catch(err => {
            return {};// If the file does not exists, return an empty object.
        });
    },

    saveStyles: function(name, result) {
        //写入数据：将result.css,result.map分别写入public/styles/${name}.css，public/styles/${name}.css.map

        const filename = `${cssDir}/${name}.css`;//即public/styles/${name}.css
        console.log(`Saving styles ${filename}`);
        return Promise.all([
            fs.writeAsync(filename, result.css,'utf8'),
            fs.writeAsync(`${filename}.map`,result.map,'utf8')
        ])
    },

    saveIndexPage: function(html) {
        //写入数据：将html写入public/index.html
        return fs.writeAsync(`${publicDir}/index.html`,html)
            .catch(err => {
                throw err;
            });
    },

    saveTemp: function(filename, content){
        //写入数据：将content写入到.tmp/${filename}

        return fs.writeAsync(`${path.resolve(__dirname,'../.tmp')}/${filename}`,content);
    }

}


