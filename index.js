const co = require('co');
const endpoints = require('./endpoints');
const chartsRender = require('./charts');

function autoGraph(){
    return co(function*(){
        const { csvs, svgTimestamps } = yield endpoints.fetchHtml();

        
    })
}