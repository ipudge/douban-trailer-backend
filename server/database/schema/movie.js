const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema
const {ObjectId, Mixed} = Schema.Types

const MovieSchema = new Schema({
  doubanId: String,
  category: [{
    type: ObjectId,
    ref: 'Category'
  }],
  directors: [String],
  casts: [String],
  rate: Mixed,
  title: String,
  summary: String,
  cover: String,

  preVideoList: Mixed,
  stagePhotoList: [String],
  posterList: [String],

  rawTitle: String,
  movieTypes: [String],
  language: [String],
  pubdates: Mixed,
  duration: [String],
  year: Number,

  tags: Array,

  watchInfo: Mixed,

  meta: {
    createAt: {
      type: Date,
      default: moment().format('YYYY-MM-DD HH:mm:ss')
    },
    updateAt: {
      type: Date,
      default: moment().format('YYYY-MM-DD HH:mm:ss')
    }
  }
})

MovieSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = moment().format('YYYY-MM-DD HH:mm:ss')
  } else {
    this.meta.updateAt = moment().format('YYYY-MM-DD HH:mm:ss')
  }
  next()
})

MovieSchema.index({doubanId: 1}, {unique: true});

mongoose.model('Movie', MovieSchema);