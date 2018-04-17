const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  movies: [{
    type: ObjectId,
    ref: 'Movie'
  }],
  meta: {
    createAt: {
      type: Date,
      default: moment().format('YYYY-MM-DD HH:mm:ss')
    },
    updateAt: {
      type: Date,
      default: moment().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  sort: {
    type: Number,
    default: 0
  }
})


CategorySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = moment().format('YYYY-MM-DD HH:mm:ss')
  } else {
    this.meta.updateAt = moment().format('YYYY-MM-DD HH:mm:ss')
  }
  next()
})

mongoose.model('Category', CategorySchema);