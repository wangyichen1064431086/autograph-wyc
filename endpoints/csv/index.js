const got = require('got');// Simplified HTTP requests
const buildArtifacts = require('../../util/build-artifacts.js');
const uri = require('../../util/uri.js');

function fetch(csvs) {
    /*
     * `csvs` is an array of object.
    */

    const  promisedStats = csvs.map(csv => {
        const url = uri.ofCsv(csv.name);//得到http://ig.ft.com/autograph/data/${csv.name}
        console.log(`fetching:${url}`);
        return got(url)//这返回的还是个promise，只不过在这个promise后面再调用.then，那这个.then的参数res就是最后的 Object.assign({},csv,{size})
        
            .then(res => {
                return buildArtifacts.saveCsv(csv.name,res.body);//将res.body写入到public/data/${csv.name}，并返回csvString的可读的大小
            })
            .then(size => {
                return Object.assign({},csv,{size});//把对象csv,{size}添加到{}上
            })
    });

    return Promise.all(promisedStats)
        .then(stats => {
            return buildArtifacts.saveCsvStats(stats);
        });
}