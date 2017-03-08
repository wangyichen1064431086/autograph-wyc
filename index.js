const chalk = require('chalk');//既有包
const endpoints = require('./endpoints');//已写完
const chartsRender = require('./charts');
const buildArticfacts = require('./util/build-artifacts.js');
const buildPage = require('./util/build-page.js')
function autoGraph(){
    return co(function*(){
        const { csvs, svgTimestamps } = yield endpoints.fetchHtml();
    })
}