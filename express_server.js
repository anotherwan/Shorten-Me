'use strict'

const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const methodOverride = require('method-override')
const PORT = process.env.PORT || 8080
const CHARS = generateRandomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
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

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls", (req, res) => {
  res.render('urls_index', { urls: urlDatabase })
});

app.delete("/urls/:id", (req, res) => {
  console.log('Deleting')
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  res.render("url_show", { shortURL: req.params.id, longURL: urlDatabase[req.params.id] });
});


app.post("/urls", (req, res) => {
  // console.log(req.body)
  let shortURL = generateRandomString(6, CHARS)
  let longUrl = req.body.longURL
  urlDatabase[shortURL] = longUrl
  res.redirect(`/urls/${shortURL}`)
})

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL)
})

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
