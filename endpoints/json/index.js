// MARK:该Module简而言之就是向http://ig.ft.com/autograph/config/nightingale-config.json 发出get请求，然后将请求的结果res.body写入public/config/nightingale-config.json


const chalk = require('chalk');
const got = require('got');
const buildArtifacts = require('../../util/build-artifacts.js');
const uri = require('../../util/uri.js');

// The returned data will be used to :
// 1. Draw charts
// 2. Extract glossary//提取词汇表
function fetch(url=uri.svgConfig) {
    //uri.svgConfig为http://ig.ft.com/autograph/config/nightingale-config.json
    //生词nightingale:夜莺
    console.log(chalk.underline.cyan(`Fetching:${url}`));

    return got(url, {
        json:true //Parse response body with JSON.parse and set accept header to application/json.
        // MARK:向http://ig.ft.com/autograph/config/nightingale-config.json 发出get请求
    })
    .then(res => {
        return res.body;
    })
    .then(body => {
        console.log(chalk.red(`\nLength of nightingable-config.json: ${body.length}\n`));
        return buildArtifacts.saveSvgConfig(body);
        //将body写入public/config/nightingale-config.json
    })
    .catch(err => {
        throw err;
    });
}

if(require.main == module) {
    fetch()
        .catch(err => {
            console.log(err);
        });
}

module.exports = fetch;