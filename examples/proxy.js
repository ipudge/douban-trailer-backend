const proxyFn = require('../server/common/proxy')

;(async () => {
  try {
    let res = await proxyFn('https://movie.douban.com/j/new_search_subjects?sort=R&range=6,10&tags=&start=0')

    res = JSON.parse(res)
    console.log(res.data.length)
  } catch (e) {
    console.log(e)
  }
})()