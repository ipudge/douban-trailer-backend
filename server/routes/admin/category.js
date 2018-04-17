const {
  controller,
  get,
  put
} = require('../../lib/decorator')
const {
  getAllCategories,
  updateCategorySort
} = require('../../service/category')

@controller('/admin/v0/category')
export class categoryController {
  @get('/all')
  async getAllCategories(ctx) {
    try {
      let categories = await getAllCategories()

      ctx.body = {
        code: 200,
        data: categories
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: e
      }
    }
  }

  @put('/sort')
  async updateCategorySort(ctx) {
    let { updateList } = ctx.request.body
    try {
      for (let item of updateList) {
        await updateCategorySort(item)
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