// function makeIterator (arr) {
// 	let nextIndex = 0

// 	return {
// 		next () {
// 			if (nextIndex < arr.length) {
// 				return {
// 					value: arr[nextIndex++],
// 					done: false
// 				}
// 			} else {
// 				return {
// 					done: true
// 				}
// 			}
// 		}
// 	}	
// }

// let iterator = makeIterator(['吃饭', '睡觉', '打豆豆']);

// console.log(iterator.next().value)
// console.log(iterator.next().value)
// console.log(iterator.next().value)
// console.log(iterator.next().done)

function * makeIterator (arr) {
	for (let i = 0; i < arr.length; i++) {
		yield arr[i]
	}
}

const gen = makeIterator(['吃饭', '睡觉', '打豆豆']);

console.log(gen.next().value)
console.log(gen.next().value)
console.log(gen.next().value)
console.log(gen.next().done)
