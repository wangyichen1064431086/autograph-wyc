// MARK:该模块简而言之就是从public/config/csv-stats.json（该数据的获取依赖于html/index.js模块）读取数据(得到一个数组csvStats), 对于csvStats中的每一项元素csv，向http://ig.ft.com/autograph/data/${csv.name} 发起get请求，并将返回值即res.body写入到public/data/${csv.name}

const got = require('got');// Simplified HTTP requests
const buildArtifacts = require('../../util/build-artifacts.js');
const uri = require('../../util/uri.js');

function getAndSaveCsv(name) {
    const url = uri.ofCsv(name);//http://ig.ft.com/autograph/data/${name}
    console.log(`Fetching:${url}`);
    return got(url)
    //got 返回的是一个Promise，其response object含有properties:res.body、res.url、res.requestUrl
        .then(res => {
            return res.body;
        })
        .then(body => {
            return buildArtifacts.saveCsv(name, body);
            // 将body写入到public/data/${name}
        })
        .catch(err => {
            return err;
        });
}

function fetchCsvs() {
   return buildArtifacts.getCsvStats()
   //从public/config/csv-stats.json读取并解析json数据,返回的是一个promise,该promise中resolve的result传递给下一个promise，这个result在这里是csvStats(是个数组)

     .then(csvStats => {
         return Promise.all(csvStats.map(csv => {
             return getAndSaveCsv(csv.name);
             //对于csvStats这个数组中的每一项csv，向http://ig.ft.com/autograph/data/${csv.name} 发起get请求，并将返回值即res.body写入到public/data/${csv.name}
         }));
     })
     .catch(err => {
         return err;
     });
}

if(require.main == module){//When a file is run directly from Node.js, **require.main** is set to its module. 
    fetchCsvs().catch(err => {
        console.log(err);
        //不明白这里为什么还要catch(err)一次，明明在fetchCsvs中已经catch(err)了
    })
}

module.exports = fetchCsvs;