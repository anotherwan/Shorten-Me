let requiredFunctions = {

   generateRandomString: function (length, CHARS) {
    var result = ''
    for (var i = length; i > 0; i--) {
      result += CHARS[Math.floor(Math.random() * CHARS.length)]
    }
    return result
  },

   findUserEmail: function (req) {
    let foundUser = null
    for (let userId in usersDatabase) {
      if (usersDatabase[userId].email === req.body.email) {
        foundUser = usersDatabase[userId]
        break
      }
    }
    return foundUser
  },

   checkBlankParams: function (req) {
    if (req.body.email === '' || req.body.password === '') {
      res.status(403).send('Email or password must be filled in')
    }
  }

}

module.exports = functions
