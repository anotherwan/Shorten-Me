'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cookieSession = require('cookie-session')
const methodOverride = require('method-override')
const PORT = process.env.PORT || 8080
const requiredFunctions = require('./requiredFunctions.js')
const CHARS = requiredFunctions.generateRandomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key']
}))

global.urlDatabase = {
  // 'b2xVn2': {
  //   id: 'b2xVn2',
  //   longURL: 'http://www.lighthouselabs.ca',
  //   userID: 'user@example.com'
  // },
  // '9sm5xK': {
  //   id: '9sm5xK',
  //   longURL: 'http://www.google.com',
  //   userID: 'user2@example.com'
  // }
}

global.usersDatabase = {
  // 'userRandomID': {
  //   id: 'userRandomID',
  //   email: 'user@example.com',
  //   password: '1234'
  // },
  // 'user2RandomID': {
  //   id: 'user2RandomID',
  //   email: 'user2@example.com',
  //   password: '4321'
  // }
}

app.get('/urls', (req, res) => {
  let userUrls = {}
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === req.session.userEmail) {
      userUrls[key] = urlDatabase[key]
    }
  }
  res.render('urls_index', {
    urls: userUrls,
    email: req.session.userEmail
   })
})

app.get('/urls/new', (req, res) => {
  let foundUser = req.session.userEmail
  if (foundUser) {
    res.render('urls_new', { userUrls: urlDatabase, email: foundUser })
  } else {
    res.redirect('/login')
  }
})

app.post('/urls', (req, res) => {
  let newShortURL = requiredFunctions.generateRandomString(6, CHARS)
  urlDatabase[newShortURL] = {
    id: newShortURL,
    longURL: req.body.longURL,
    userID: req.session.userEmail
  }
  res.redirect(`/urls`)
})

app.get('/urls/:id', (req, res) => {
  res.render('url_show', {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    email: req.session.userEmail })
})

app.get('/urls/:id/edit', (req, res) => {
  let foundUser = req.session.userEmail
  if (foundUser) {
    res.render('url_show_edit', {
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id].longURL,
      email: foundUser })
  } else {
    res.redirect('/login')
  }
})

//route for editing single short url
app.put('/urls/:id', (req, res) => {
  let newLongURL = req.body.updatedLongURL
  urlDatabase[req.params.id].longURL = newLongURL
  res.redirect('/urls')
})

app.delete('/urls/:id', (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
})

app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL)
})

app.get('/register', (req, res) => {
  res.render('registration')
})

app.post('/register', (req, res) => {
  requiredFunctions.checkBlankParams(req)
  let foundUser = requiredFunctions.findUserEmail(req)
  if (foundUser) {
    res.status(403).send('Email already exists!')
  } else {
    let randomUserId = requiredFunctions.generateRandomString(6, CHARS)
    let foundUser = req.body.email
    req.session.userEmail = foundUser
    usersDatabase[randomUserId] = {
      id: randomUserId,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    }
    res.redirect('/urls')
  }
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.put('/login', (req, res) => {
  requiredFunctions.checkBlankParams(req)
  let foundUser = requiredFunctions.findUserEmail(req)
  if (!foundUser || !bcrypt.compareSync(req.body.password, foundUser.password)) {
    res.status(403).send('Incorrect email or password')
  } else {
    req.session.userEmail = foundUser.email
    res.redirect('/urls')
  }
})

app.post('/logout', (req, res) => {
  req.session = null
  res.redirect('/login')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})
