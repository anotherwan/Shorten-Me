'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const PORT = process.env.PORT || 8080
const CHARS = generateRandomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
// const bcrypt = require('bcrypt')
// const hashed_password = bcrypt.hashSync(password, 10)


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))


global.urlDatabase = {
  'b2xVn2': {
    longURL: 'http://www.lighthouselabs.ca',
    userID: 'userRandomID'
  },
  '9sm5xK': {
    longURL: 'http://www.google.com',
    userID: 'user2RandomID'
  }

}

global.usersDatabase = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'user@example.com',
    password: '1234'
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: '4321'
  }
}

function generateRandomString(length, CHARS) {
  var result = ''
  for (var i = length; i > 0; i--) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return result
}

function findUserEmail(req) {
  let foundUser = null
  for (let userId in usersDatabase) {
    if (usersDatabase[userId].email === req.body.email) {
      foundUser = usersDatabase[userId]
      break
    }
  }
  return foundUser
}

function checkBlankParams(req) {
  if (req.body.email === '' || req.body.password === '') {
    res.status(403).send('Email or password must be filled in')
  }
}

app.get('/urls', (req, res) => {
  res.render('urls_index', {
    urls: urlDatabase,
    email: req.cookies.userEmail
   })
})

app.get('/urls/new', (req, res) => {
  let foundUser = req.cookies.userEmail
  console.log(foundUser)
  if (foundUser) {
    res.render('urls_new', { userUrls: urlDatabase, email: foundUser })
  } else {
    res.redirect('/login')
  }

})

app.post('/urls', (req, res) => {
  let shortURL = generateRandomString(6, CHARS)
  let longUrl = req.body.longURL
  urlDatabase[shortURL] = longUrl
  res.redirect(`/urls/${shortURL}`)
})

app.get('/urls/:id', (req, res) => {
  res.render('url_show', { shortURL: req.params.id, longURL: urlDatabase[req.params.id] })
})

app.get('/urls/:id/edit', (req, res) => {
  res.render('url_show_edit', { shortURL: req.params.id, longURL: urlDatabase[req.params.id] })
})

app.put('/urls/:id', (req, res) => {
  let newLongURL = req.body.updatedLongURL
  urlDatabase[req.params.id] = newLongURL
  res.redirect('/urls')
})

app.delete('/urls/:id', (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
})

app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL)
})


app.get('/login', (req, res) => {
  res.render('login')
})

app.put('/login', (req, res) => {
  checkBlankParams(req)
  let foundUser = findUserEmail(req)
  if (!foundUser || foundUser.password != req.body.password) {
    res.status(403).send('Incorrect email or password')
  } else {
    res.cookie('userEmail', foundUser.email)
    res.redirect('/urls')
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('userEmail')
  res.redirect('/login')
})

app.get('/register', (req, res) => {
  res.render('registration')
})

app.post('/register', (req, res) => {
  checkBlankParams(req)
  let foundUser = findUserEmail(req)
  if (foundUser) {
    res.status(403).send('Email already exists!')
  } else {
    let randomUserId = generateRandomString(6, CHARS)
    let foundUser = req.body.email
    res.cookie('userEmail', foundUser)
    usersDatabase[randomUserId] = {
      id: randomUserId,
      email: req.body.email,
      password: req.body.password
    }
    res.redirect('/urls')
  }
})

// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase)
// })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})

// get /
//const current_user = req.signedCookies.current_user

// const username = data,ysers,find((user) => {
//   return user,name === username
// })

// bcrypt.compare(password, user.password, (err, matched) => {
//   if (matched) {
//     ('curreent_user',, user.username, {
//       signed: true})
//       res.redirect('/treassure')
//     })
//     else {
//       res.redirect('/login/')
//     }
//   }
// })
// }
// post '/signup'
// bcrypt.hash(req.body.password, 10, )
