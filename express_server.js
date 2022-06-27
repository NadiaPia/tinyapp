const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())



app.set ("view engine", "ejs"); //This tells the Express app to use EJS as its templating engine.

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]
   };
  res.render("urls_index", templateVars);
  
});

app.get("/urls/new", (req, res) => {
  const templateVars = {    
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString(6);
  res.redirect(`/urls/${shortURL}`)
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  urlDatabase[shortURL] = req.body["longURL"];
  //console.log(urlDatabase)

});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`)
})

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body["longURL"];
  res.redirect(`/urls/${req.params.shortURL}`)
})

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username)
  //console.log("uuuuuuuuu", req.body.username)  
  res.redirect(`/urls`)
})

app.post("/logout", (req, res) => {
  res.clearCookie('username') 
  res.redirect(`/urls`)
})


function generateRandomString(n) {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for ( let i = 0; i < n; i++ ) {
    const index = Math.floor(Math.random() * characters.length)    
    randomString += characters[index]
 }
 return randomString;

}
console.log(generateRandomString(6))


app.get("/urls/:shortURL", (req, res) => {
  
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  //console.log(req)
  res.render("urls_show", templateVars);
  
  
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log(longURL)
  res.redirect(longURL);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});