'use strict'

const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const methodOverride = require('method-override')
const PORT = process.env.PORT || 8080
const CHARS = generateRandomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

app.set("view engine", "ejs")
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


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "mrrOOa": "http://www.soundcloud.com"
};

function generateRandomString(length, CHARS) {
  var result = ''
  for (var i = length; i > 0; i--) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return result
}


app.get("/urls", (req, res) => {

  console.log(req.cookies.username)
  res.render('urls_index', {
    urls: urlDatabase,
    username: req.cookies.username
   })
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  res.render("url_show", { shortURL: req.params.id, longURL: urlDatabase[req.params.id] });
});

app.get("/urls/:id/edit", (req, res) => {
  res.render("url_show_edit", { shortURL: req.params.id, longURL: urlDatabase[req.params.id] })
});

app.put("/urls/:id", (req, res) => {
  let newLongURL = req.body.updatedLongURL
  urlDatabase[req.params.id] = newLongURL
  res.redirect('/urls')
})

app.delete("/urls/:id", (req, res) => {
  // console.log('Deleting')
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
})

app.post("/urls", (req, res) => {
  // console.log(req.body)
  let shortURL = generateRandomString(6, CHARS)
  let longUrl = req.body.longURL
  urlDatabase[shortURL] = longUrl
  res.redirect(`/urls/${shortURL}`)
})

app.get("/u/:shortURL", (req, res) => {
  // console.log(req.params)
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL)
})

app.post("/login", (req, res) => {
  let Username = req.body.username
  res.cookie('username', Username)
  res.redirect('/urls')
})

app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect('/urls')
})

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//refactor existing routes to render templates
//change the object you're passing in in /urls
//show username on template ejs
//
