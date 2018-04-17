let arrow = {
	a: 2,
	simple: function () {
		setTimeout(function () {
			console.log(this.a)
		}, 0)
	},
	simpleWithThis: function () {
		let that = this;
		setTimeout(function () {
			console.log(that.a)
		}, 0)
	},
	simpleWithArrow: function () {
		setTimeout(() => {
			console.log(this.a)
		}, 0)
	},
	simpleWithGlobal: () => {
		setTimeout(() => {
			console.log(this.a)
		}, 0)
	}
}

arrow.simple()
arrow.simpleWithThis()
arrow.simpleWithArrow()
arrow.simpleWithGlobal()