'use strict'

const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080

app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls", (req, res) => {
  res.render('urls_index', { urls: urlDatabase })
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/urls/:id", (req, res) => {
  res.render("url_show", { shortURL: req.params.id, longURL: urlDatabase[req.params.id] });
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
