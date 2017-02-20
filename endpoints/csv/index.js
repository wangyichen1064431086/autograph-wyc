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
        return got(url)
            .then(res => {
                return buildArtifacts.saveCsv(csv.name,res.body);
            })
            .then(size => {
                return Object.assign({},csv,{size});
            })
    });

    return Promise.all(promisedStats)
        .then(stats => {
            return buildArtifacts.saveCsvStats(stats);
        });
}