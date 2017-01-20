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


const urlDatabase = {
                    "b2xVn2": "http://www.lighthouselabs.ca",
                    "9sm5xK": "http://www.google.com",
                    "mrrOOa": "http://www.soundcloud.com"
                  };

global.usersDatabase = {
  "user_random_id_1": {
                    id: "userRandomID",
                    email: "user@example.com",
                    password: "1234"
                  },
  "user_random_id_2": {
                    id: "user2RandomID",
                    email: "user2@example.com",
                    password: "4321"
                  }
}

function generateRandomString(length, CHARS) {
  var result = ''
  for (var i = length; i > 0; i--) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return result
}


app.get("/urls", (req, res) => {
  // console.log(req.cookies.user_email)
  res.render('urls_index', {
    urls: urlDatabase,
    email: req.cookies.user_email
   })
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(6, CHARS)
  let longUrl = req.body.longURL
  urlDatabase[shortURL] = longUrl
  res.redirect(`/urls/${shortURL}`)
})

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
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
})

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL)
})


app.get('/login', (req, res) => {
  res.render('login')
})

app.put("/login", (req, res) => {
  for (let user_id in usersDatabase) {
    if (usersDatabase[user_id].email === req.body.email && usersDatabase[user_id].password === req.body.password) {
      res.cookie('user_email', usersDatabase[user_id].email)
      res.redirect('/urls')
    } else {
      res.status(403).send('Email and/or password do not match')
    }
  }
  // let emailMatch = false
  // let passwordMatch = false
  // for (let user_id in usersDatabase) {
  //   if (usersDatabase[user_id].email === req.body.email) {
  //     if (usersDatabase[user_id].password === req.body.password) {
  //       emailMatch = true
  //       passwordMatch = true
  //     }
  //   }
  // }
  // if (emailMatch === true && passwordMatch === true) {
  //   res.cookie('user_email', req.body.email)
  //   res.redirect('/urls')
  // } else {
  //   res.status(403).send('Email and/or password do not match!')
  // }
})

// app.put("/login", (req, res) => {
//   let emailMatch = false
//   let passwordMatch = false
//   for (let user_id in usersDatabase) {
//     if (usersDatabase[user_id].email === req.body.email) {
//       if (usersDatabase[user_id].password === req.body.password) {
//         emailMatch = true
//         passwordMatch = true
//       }
//     }
//   }
//   if (emailMatch === true && passwordMatch === true) {
//     res.cookie('user_email', req.body.email)
//     res.redirect('/urls')
//   } else {
//     res.status(400).send('Email and/or password do not match!')
//   }
// })

app.post("/logout", (req, res) => {
  res.clearCookie('user_email')
  res.redirect('/urls')
})

app.get('/register', (req, res) => {
  res.render('registration')
})

app.post('/register', (req, res) => {
  let randomUserId = generateRandomString(6, CHARS)
  let emailExists = false;
  for (var user_id in usersDatabase) {
    if (usersDatabase[user_id].email === req.body.email) {
      emailExists = true;
    }
  }
  if (emailExists) {
    res.status(400).send('Email already exists!')
  } else if (req.body.email === "" || req.body.password === "") {
    res.status(400).send('Please enter both an email and password!')
  } else {
    res.cookie('user_email', req.body.email)
    usersDatabase[randomUserId] = {
      id: randomUserId,
      email: req.body.email,
      password: req.body.password
    }
  }
  res.redirect('/urls')
})





// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

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
