const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8080; // default port 8080

/*const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};*/
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
//console.log(users);
//console.log(urlDatabase);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const generateRandomString = function(n) {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters[index];
  }
  return randomString;
};
//console.log(generateRandomString(6));

const checkTheSameEmail = function(email) {
  for (let eAddress in users) {
    console.log(users[eAddress].email);
    if (email === users[eAddress].email) {
      return users[eAddress];
    }
  }
  return false;
};

const urlsForUser = function(id) {
  const result = {}
  for (let shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl].userID === id) {
      result[shortUrl] = urlDatabase[shortUrl]      
    }  
  } return result
} 
//console.log(urlsForUser("abc"))

app.set("view engine", "ejs"); //This tells the Express app to use EJS as its templating engine.

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const userId = req.cookies.userId;
  
  const templateVars = {    
    urls: urlsForUser(userId),
    user: users[userId]
  };
  if (!userId || !users[userId]) {
    res.send("Hooray! It's time to log in!"); 
    return
  }

  res.render("urls_index", templateVars);
  
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.userId;
  if (!userId || !users[userId]) {
    res.redirect("/login"); 
  }
  const templateVars = {
    user: users[userId]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies.userId;
  if (!urlDatabase[req.params.shortURL])  {    
    res.send("URL doesn't exist")
    return
  }
  if (urlDatabase[req.params.shortURL].userID !== userId) {
    res.send("No permission")
    return
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
  const userId = req.cookies.userId; //user in cookies
 
  if (!userId || !users[userId]) {
  const templateVars = {
    user: users[userId]
  };
  res.render("register", templateVars);
} else {
  res.redirect("/urls")
}
  
});

app.get("/login", (req, res) => {
  const userId = req.cookies.userId;
  const templateVars = {
    user: users[userId]
  };
  
  res.render("login", templateVars);
  
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString(6);
  res.redirect(`/urls/${shortURL}`);
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.cookies.userId};

});

app.post("/register", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  const id = generateRandomString(6);
  console.log("userId", id);
  if (req.body.email === '' || req.body.password === '' || checkTheSameEmail(req.body.email)) {
    res.send(400);
  } else {
    users[id] = {
      id: id,
      email: req.body.email,
      password: req.body.password
    };
  }

  res.cookie('userId', id);
  console.log(users);
  res.redirect(`/urls`);

});

app.post("/urls/:shortURL/delete", (req, res) => {
const userId = req.cookies.userId;
 if (!urlDatabase[req.params.shortURL])  {    
    res.send("URL doesn't exist")
    return
  }
  if (urlDatabase[req.params.shortURL].userID !== userId) {
    res.send("No permission")
    return
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL", (req, res) => {  //edit
  const userId = req.cookies.userId;
  if (!userId || !users[userId]) {
    res.send(403); 
    return
  }
  if (!urlDatabase[req.params.shortURL])  {    
    res.send("URL doesn't exist")
    return
  }
  if (urlDatabase[req.params.shortURL].userID !== userId) {
    res.send("No permission")
    return
  }
  urlDatabase[req.params.shortURL] = {longURL: req.body.longURL, userID: req.cookies.userId};;
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.post("/login", (req, res) => {
  const user = checkTheSameEmail(req.body.email);
  if (!user) {
    res.send(403);
  }
  if (req.body.password !== user["password"]) {
    res.send(403);
  }
  res.cookie('userId', user["id"]);
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  console.log(req);
  res.clearCookie('userId');
  res.redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});