const mongoose = require('mongoose')
const User = mongoose.model('User')

export const checkPassword = async (email, password) => {
  let match = false;

  let user = await User.findOne({email})

  if (user && !user.isLocked) {
    match = await user.comparePassword(password, user.password)
  }

  return {
    match,
    user
  }
}