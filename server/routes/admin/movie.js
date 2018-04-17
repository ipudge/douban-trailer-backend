const {
  controller,
  get,
  del
} = require('../../lib/decorator')
const {
  getAllMovies,
  getMovieDetailById,
  getMovieDetailByDoubanId,
  getMovieCounts,
  delMovie
} = require('../../service/movie')
const config = require('../../config')

@controller('/admin/v0/movies')
export class movieController {
  @get('/')
  async getMovieList(ctx) {
    let {
      types,
      year,
      page,
      size,
      doubanId
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

      ctx.body = {
        code: 200,
        data: movie
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: e
      }
    }
  }

  @del('/:id')
  async delMovieById(ctx) {
    let id = ctx.params.id

    try {
      let movie = await getMovieDetailById(id)

      if (movie) {
        await delMovie(movie)
      }

      ctx.body = {
        code: 200,
        data: ''
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: e
      }
    }
  }
}