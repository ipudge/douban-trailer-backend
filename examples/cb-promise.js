const fs = require('fs')


// function readFileAsync() {
// 	return new Promise((resolve, reject) => {
// 		fs.readFile('./package.json', (err, data) => {
// 			if (err) {
// 				return reject(err)
// 			}

// 			data = JSON.parse(data);

// 			resolve(data.name)
// 		})
// 	})
// }

// readFileAsync().then((name) => {
// 	console.log(name)
// }).catch((e) => {
// 	console.log(e)
// })

const util = require('util')

// util.promisify(fs.readFile)('./package.json')
//   .then(JSON.parse)
//   .then(data => {
//   	console.log(data.name)
//   })
//   .catch(e => {
//   	console.log(e)
//   })
const readFileAsync = util.promisify(fs.readFile)

async function init () {
	try {
		let data = await readFileAsync('./package.json');

		data = JSON.parse(data)

		console.log(data.name)

	} catch (e) {
		console.log(e)
	}
}

init()




