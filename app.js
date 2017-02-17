const koa = require('koa');
const serve = require('koa-static');
const logger = require('koa-logger');


const app = koa();

app.use(serve('public',{
	index: false
}));

app.use(logger());


app.use(function *(){
	const today = new Date().toDateString();
	
})
