const {
  controller,
  get
} = require('../../lib/decorator')
const {
  getAllMovies,
  getMovieDetailById,
  getMovieDetailByDoubanId,
  getMovieCounts,
  getRelativeMovies
} = require('../../service/movie')
const config = require('../../config')

@controller('/api/v0/movies')
export class movieController {
  @get('/')
  async getMovieList(ctx) {
    let {
      types,
      year,
      page,
      size,
      doubanId,
      videoExists
    } = ctx.query
    try {
      if (doubanId) {
        let movie = await getMovieDetailByDoubanId(doubanId)

        if (movie) {
          ctx.body = {
            code: 200,
            data: {
              list: [movie],
              totalRecord: 1
            }
          }
        } else {
          ctx.body = {
            code: 200,
            data: {
              list: [],
              totalRecord: 0
            }
          }
        }
      } else {
        let query = {}

        if (types) {
          query.category = {
            $in: types.split(',')
          }
        }
        if (year) {
          query.year = year
        }
        if (videoExists && parseInt(videoExists) === 1) {
          query.preVideoList = {$exists: true}
        }
        page = parseInt(page, 10) || 1
        page = page > 0 ? page : 1
        size = Number(size) || config.list_movie_count

        let count = await getMovieCounts(query)
        let movies = await getAllMovies(query, page, size)

        ctx.body = {
          code: 200,
          data: {
            list: movies || [],
            totalRecord: count
          }
        }
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: e
      }
    }
  }

  @get('/:id')
  async getMovieDetail(ctx) {
    let id = ctx.params.id

    try {
      let movie = await getMovieDetailById(id)
      let relativeMovies = await getRelativeMovies(movie)

      ctx.body = {
        code: 200,
        data: {
          movie,
          relativeMovies
        }
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: e
      }
    }
  }
}