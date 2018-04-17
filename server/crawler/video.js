const puppeteer = require('puppeteer')
const chromeFinder = require('chrome-finder')

const base = 'https://movie.douban.com/subject/'
const doubanId = '26861685'
let link = ''
let video


const sleep = time => new Promise(resolve => {
	setTimeout(resolve, time)
})

;(async () => {
	console.log('start visit the target page')

	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		dumpio: false
	})

	const page = await browser.newPage()
	await page.goto(base + doubanId, {
		waitUntil: 'networkidle2'
	})

	await sleep(2000)

	const result = await page.evaluate(() => {
		const $ = window.$
		let videoWrapper = $('.related-pic-video')
		if (videoWrapper.length) {
			let img = videoWrapper.find('img').attr('src')
			link = videoWrapper.attr('href')

			return {
				img,
				link
			}
		}
		return {};
	})
	if (result.link) {
		await page.goto(result.link, {
			waitUntil: 'networkidle2'
		})

		await sleep(2000)

		video = await page.evaluate(() => {
			const $ = window.$
			let sourceWrapper = $('source')
			if (sourceWrapper.length) {
				return sourceWrapper.attr('src')
			}
			return '';
		})
	}
	browser.close()

	let data = {
		video,
		doubanId,
		videoBg: result.img
	}

	process.send({data})
	process.exit(0)
 })()