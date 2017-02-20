const koa = require('koa');
const serve = require('koa-static');
const logger = require('koa-logger');//Development style logger middleware for Koa.
const buildArtifacts = require('./util/build-artifacts.js');//该文件待看

const render = require('./util/render.js');//该文件待看

const app = koa();

app.use(serve('public',{
	index: false
}));

app.use(logger());


app.use(function *(){
	const today = new Date().toDateString();
	const {csvs, charts} = yield {
		csvs: buildArtifacts.getCsvStats(),
		charts: buildArtifacts.getSvgStats()
	};




});

const server = app.listen(process.env.PORT || 3000);

server.on('listening',()=>{
	console.log(`Client listening on port of ${process.env.PORT || 3000}`);
});