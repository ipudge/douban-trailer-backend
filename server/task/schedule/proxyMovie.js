const proxyFn = require('../../common/proxy')
const mongoose = require('mongoose')
const cheerio = require('cheerio')
const moment = require('moment')
const logger = require('../../common/logger')
const limit = 20
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

async function fetchMovie(start) {
  const movieList_api = `https://movie.douban.com/j/new_search_subjects?sort=R&range=6,10&tags=%E7%94%B5%E5%BD%B1&start=${start}&limit=${limit}`;
  try {
    let res = await proxyFn(movieList_api)
    res = JSON.parse(res)
    return res
  } catch (e) {
    throw new Error(e)
  }
}

async function fetchMovieDetail(item) {
  const url = `https://api.douban.com/v2/movie/${item.doubanId}`

  try {
    let res = await proxyFn(url)
    res = JSON.parse(res)
    return res
  } catch (e) {
    throw new Error(e)
  }
}

async function fetchContent(url) {
  try {
    let res = await proxyFn(url)
    let $ = cheerio.load(res)

    return $
  } catch (e) {
    throw new Error(e)
  }
}

async function getMovieWatchInfoAndRate(item) {
  let $ = await fetchContent(`https://movie.douban.com/subject/${item.id}/`)
  let watchInfo = $('.subject-others-interests-ft a'),
    doing = 0,
    done = 0,
    want = 0
  if (watchInfo.length === 2) {
    done = parseInt(watchInfo.eq(0).text().split('人')[0])
    want = parseInt(watchInfo.eq(1).text().split('人')[0])
  } else {
    doing = parseInt(watchInfo.eq(0).text().split('人')[0])
    done = parseInt(watchInfo.eq(1).text().split('人')[0])
    want = parseInt(watchInfo.eq(2).text().split('人')[0])
  }
  let rate = $('.rating_num').text()
  let rateNum = $('.rating_people span').text()
  let starWrapper = $('.ratings-on-weight .item')
  let star5 = starWrapper.eq(0).find('.rating_per').text()
  let star4 = starWrapper.eq(1).find('.rating_per').text()
  let star3 = starWrapper.eq(2).find('.rating_per').text()
  let star2 = starWrapper.eq(3).find('.rating_per').text()
  let star1 = starWrapper.eq(4).find('.rating_per').text()

  return {
    watchInfo: {
      doing,
      done,
      want
    },
    rate: {
      rate,
      rateNum,
      star: {
        star5,
        star4,
        star3,
        star2,
        star1
      }
    }
  }
}

async function delMovies() {
  let movies = await Movie.find({
    'meta.updateAt': {$lt: moment().subtract(10, 'hour')}
  })
  for (let item of movies) {
    let categories = item.category
    for (let categoryId of categories) {
      let category = await Category.findOne({_id: categoryId})
      category.movies.splice(category.movies.indexOf(item._id), 1)
      await category.save()
    }
    await item.remove()
  }
}

const fetchMovieListAndSave = async () => {
  let flag = true
  let start = 0
  while (flag) {
    let movieList = await fetchMovie(start)
    if (movieList.data.length) {
      for (let item of movieList.data) {
        try {
          let movie = await Movie.findOne({doubanId: item.id})
          if (!movie) {
            let cover = item.cover.replace(/s_ratio_poster/, 'l_ratio_poster').replace(/.webp/, '.jpg')
            let movieWatchInfoAndRate = await getMovieWatchInfoAndRate(item)
            movie = new Movie({
              directors: item.directors,
              title: item.title,
              casts: item.casts,
              doubanId: item.id,
              watchInfo: movieWatchInfoAndRate.watchInfo,
              rate: movieWatchInfoAndRate.rate,
              cover
            })
            await movie.save()
            await sleep(1000)
          } else {
            let movieWatchInfoAndRate = await getMovieWatchInfoAndRate(item)
            movie.watchInfo = movieWatchInfoAndRate.watchInfo
            movie.rate = movieWatchInfoAndRate.rate
            await movie.save()
            await sleep(1000)
          }
        } catch (e) {
          logger.error(e)
          logger.info(`movie :${item.id}`)
          continue
        }
      }
    }
    if (movieList.data.length === limit) {
      start += limit
      await sleep(1000)
    } else {
      flag = false
    }
  }
}

const fetchAllMovieDetailAndSave = async () => {
  let movies = await Movie.find({
    $or: [
      {summary: {$exists: false}},
      {summary: null},
      {title: ''},
      {summary: ''}
    ]
  })
  for (let movie of movies) {
    let movieData = await fetchMovieDetail(movie)
    if (movieData) {
      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rawTitle = movieData.title || ''

      if (movieData.attrs) {
        movie.movieTypes = movieData.attrs.movie_type || []

        for (let item of movie.movieTypes) {
          let cat = await Category.findOne({
            name: item
          })

          if (!cat) {
            cat = new Category({
              name: item,
              movies: [movie._id]
            })
          } else {
            if (cat.movies.indexOf(movie._id) === -1) {
              cat.movies.push(movie._id)
            }
          }

          await cat.save()

          if (!movie.category) {
            movie.category.push(cat._id)
          } else {
            if (movie.category.indexOf(cat._id) === -1) {
              movie.category.push(cat._id)
            }
          }
        }

        let dates = movieData.attrs.pubdate || []
        let pubdates = []

        dates.map((item) => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = '未知'

            if (parts[1]) {
              country = parts[1].split(')')[0]
            }
            pubdates.push({
              date: new Date(date),
              country
            })
          }
        })
        movie.pubdates = pubdates
        movie.duration = movieData.attrs.movie_duration
        movie.year = movieData.attrs.year[0]
        movie.language = movieData.attrs.language
      }

      movie.tags.forEach((tag) => {
        movie.tags.push(tag.name)
      })
    }
    await movie.save()
    await sleep(3000)
  }
}

const fetchAllMovieVideoAndPhoto = async () => {
  let movieList = await Movie.find({})
  for (let item of movieList) {
    let $_V = await fetchContent(`https://movie.douban.com/subject/${item.doubanId}/trailer`)
    let videoWrapper = $_V('.mod').eq(0).find('li')
    if (videoWrapper.length) {
      let preVideoList = []
      for (let i = 0, length = videoWrapper.length; i < length; i++) {
        let video = videoWrapper.eq(i)
        let img = video.find('img').attr('src')
        let videoLink = video.find('.pr-video').attr('href')
        let desc = video.find('p').eq(0).text()
        let time = video.find('p').eq(1).text()
        let $_1 = await fetchContent(videoLink)
        let videoUrl = $_1('.vjs-douban source').attr('src')
        preVideoList.push({
          img,
          videoUrl,
          desc,
          date: new Date(time)
        })
      }
      item.preVideoList = preVideoList
    }
    await sleep(2000)
    let $_S = await fetchContent(`https://movie.douban.com/subject/${item.doubanId}/photos?type=S`)
    let stagePhotoWrapper = $_S('.poster-col3').find('img')
    if (stagePhotoWrapper.length) {
      let stagePhotoList = []
      for (let i = 0, length = stagePhotoWrapper.length; i < length; i++) {
        let item = stagePhotoWrapper.eq(i)
        let imgSrc = item.attr('src')
        stagePhotoList.push(imgSrc)
      }
      item.stagePhotoList = stagePhotoList
    }
    await sleep(2000)
    let $_R = await fetchContent(`https://movie.douban.com/subject/${item.doubanId}/photos?type=R`)
    let posterWrapper = $_R('.poster-col3').find('img')
    if (posterWrapper.length) {
      let posterList = []
      for (let i = 0, length = posterWrapper.length; i < length; i++) {
        let item = posterWrapper.eq(0)
        let imgSrc = item.attr('src')
        posterList.push(imgSrc)
      }
      item.posterList = posterList
    }
    await item.save()
    await sleep(2000)
  }
}

export const movieTask = async () => {
  try {
    await fetchMovieListAndSave()
    await delMovies()
    await fetchAllMovieVideoAndPhoto()
    await fetchAllMovieDetailAndSave()
  } catch (e) {
    console.log(e)
  }
}