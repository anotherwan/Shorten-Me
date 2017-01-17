'use strict'

const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const PORT = process.env.PORT || 8080
const CHARS = generateRandomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "mrrOOa": "hhtp://www.soundcloud.com"
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

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  res.render("url_show", { shortURL: req.params.id, longURL: urlDatabase[req.params.id] });
});


app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(6, CHARS)
  res.redirect(`http://localhost:8080/urls/${shortURL}`)
})

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  // console.log(longURL)
  res.redirect(longURL)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
