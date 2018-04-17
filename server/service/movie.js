const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

export const getAllMovies = async (query, page, size) => {
  let  movies = await Movie.find(query,'doubanId directors rate title summary poster movieTypes casts').skip((page - 1) * size).limit(size)

  return movies
}

export const getMovieDetailById = async (id) => {
  let movie = await Movie.findOne({_id: id})

  return movie
}

export const getMovieDetailByDoubanId = async (doubanId) => {
  let movie = await Movie.findOne({doubanId})

  return movie
}

export const getRelativeMovies = async (movie) => {
  let reletiveMovies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    }
  }, 'doubanId directors rate title summary poster movieTypes casts').sort({'rate.rate': -1}).limit(5)

  return reletiveMovies
}

export const getMovieCounts = async (query) => {
  let count = await Movie.count(query)

  return count
}

export const delMovie = async (movie) => {
  let categories = movie.category
  for (let categoryId in categories) {
    let category = await Category.findOne({_id: categoryId})
    category.movies.splice(category.movies.indexOf(movie._id), 1)
    await category.save()
  }
  await movie.remove()
}