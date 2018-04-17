const { readFile } = require('fs')
const EventEmitter = require('events')

class EE extends EventEmitter {}

const yy = new EE();

yy.on('event', () => {
	console.log('粗大事啦')
})

setTimeout(() => {
	console.log('0 毫米厚到期执行')
}, 0)

setTimeout(() => {
	console.log('100 毫米厚到期执行')
}, 100)

setTimeout(() => {
	console.log('200 毫米厚到期执行')
}, 200)

readFile('../package.json', 'utf-8', data => {
	console.log('完成文件操作的回调')
})

readFile('../package-lock.json', 'utf-8', data => {
	console.log('完成文件操作的回调')
})

setImmediate(() => {
	console.log('immediate 立即执行')
})

process.nextTick(() => {
	console.log('process.nextTick 执行')
})

Promise.resolve()
	.then(() => {
		yy.emit('event')

		process.nextTick(() => {
			console.log('process.nextTick 第二次执行')
		})

		console.log('Promise 的第 1 次回调')
	})
	.then(() => {
		console.log('Promise 的第二次回调')
	})	





