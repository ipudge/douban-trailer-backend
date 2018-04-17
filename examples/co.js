const co = require('co')
const fetch = require('node-fetch')

co(function *() {
	const res = yield fetch('https://admin.douban.com/v2/movie/1291843')
	const movie = yield res.json()
	const summary = movie.summary;
	
	console.log(summary)
})