const koa = require('koa');
const app = koa();

app.use(function *(next){
	var start = new Date;
	yield next;
	var ms = new Date - start;
	this.set('X-ResponseTime',ms+'ms');
	console.log('%s %s - %s',this.method,this.url,ms)
});

app.use(function *(next){
	var start = new Date;
	yield next;
	var ms = new Date - start;
	console.log('%s %s - %s',this.method,this.url,ms);
});

app.use(function *(){ 
	this.body = 'Hello World';
});

app.listen(3000);