module.exports = {
    fetchCsv: require('./csv'),
        //MARK:该模块简而言之就是从public/config/csv-stats.json（该数据的获取依赖于html/index.js模块,即this.extractStats）读取数据(得到一个数组csvStats), 对于csvStats中的每一项元素csv，向http://ig.ft.com/autograph/data/${csv.name} 发起get请求，并将返回值即res.body写入到public/data/${csv.name}
    fetchJson: require('./json'),
        //MARK:该Module简而言之就是向http://ig.ft.com/autograph/config/nightingale-config.json 发出get请求，然后将请求的结果res.body写入public/config/nightingale-config.json
    extractStats: require('./html')
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
};