const {generateRandomString, checkTheSameEmail, urlsForUser} = require('./helpers.js')
const express = require("express");
const app = express();
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
const PORT = 8080; // default port 8080
const bcrypt = require('bcryptjs');

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "abc"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "abc"
  },
  idfort: {
    longURL: "https://www.google.ca",
    userID: "rty"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },

  "abc": {
    id: "abc",
    email: "q@a.z",
    password: "qaz"
  }
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs"); //This tells the Express app to use EJS as its templating engine.

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const userId = req.session.userId;
  
  const templateVars = {
    urls: urlsForUser(userId, urlDatabase),
    user: users[userId]
  };
  if (!userId || !users[userId]) {
    res.send("Hooray! It's time to log in!");
    return;
  }

  res.render("urls_index", templateVars);
  
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.userId;
  if (!userId || !users[userId]) {
    res.redirect("/login");
  }
  const templateVars = {
    user: users[userId]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.userId;
  if (!urlDatabase[req.params.shortURL]) {
    res.send("URL doesn't exist");
    return;
  }
  if (urlDatabase[req.params.shortURL].userID !== userId) {
    res.send("No permission");
    return;
  }
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[userId]
  };
  res.render("urls_show", templateVars);
  
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  console.log(longURL);
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/register", (req, res) => {
  const userId = req.session.userId; //user in cookies
 
  if (!userId || !users[userId]) {
    const templateVars = {
      user: users[userId]
    };
    res.render("register", templateVars);
  } else {
    res.redirect("/urls");
  }
  
});

app.get("/login", (req, res) => {
  const userId = req.session.userId;
  const templateVars = {
    user: users[userId]
  };
  
  res.render("login", templateVars);
  
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  res.redirect(`/urls/${shortURL}`);
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.session.userId};

});

app.post("/register", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  const id = generateRandomString(6);
  console.log("userId", id);
  if (req.body.email === '' || req.body.password === '' || checkTheSameEmail(req.body.email, users)) {
    res.send(400);
  } else {
    users[id] = {
      id: id,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10) // found in the req.params object
    };
  }

  req.session.userId = id;
  console.log(users);
  res.redirect(`/urls`);

});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.session.userId;
  if (!urlDatabase[req.params.shortURL]) {
    res.send("URL doesn't exist");
    return;
  }
  if (urlDatabase[req.params.shortURL].userID !== userId) {
    res.send("No permission");
    return;
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL", (req, res) => {  //edit
  const userId = req.session.userId; //req.cookie.userId were replaysed by req.session ;
  if (!userId || !users[userId]) {
    res.send(403);
    return;
  }
  if (!urlDatabase[req.params.shortURL]) {
    res.send("URL doesn't exist");
    return;
  }
  if (urlDatabase[req.params.shortURL].userID !== userId) {
    res.send("No permission");
    return;
  }
  urlDatabase[req.params.shortURL] = {longURL: req.body.longURL, userID: req.session.userId};
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.send(400);
    return
  }
  const user = checkTheSameEmail(req.body.email, users);
  if (!user) {
    res.send(403);
  }
  if (!bcrypt.compareSync(req.body.password, user.password)) {    
    res.send(403);
    return;
  }
  
  req.session.userId = user.id;
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {  
  req.session = null;
  res.redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});