const mongoose = require('mongoose')
const Category = mongoose.model('Category')

export const getAllCategories = async () => {
  let  categories = await Category.find().sort({sort: 1})

  return categories
}

export const updateCategorySort = async (category) => {
  await Category.findOneAndUpdate({_id: category._id}, { $set: {sort: category.sort}})
}

