
const generateRandomString = function(n) {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters[index];
  }
  return randomString;
};

const checkTheSameEmail = function(email, dataBase) {
  for (let eAddress in dataBase) {
    //console.log(dataBase[eAddress].email);
    if (email === dataBase[eAddress].email) {
      return dataBase[eAddress];
    }
  }
  return false;
};

const urlsForUser = function(id, dataBase) {
  const result = {};
  for (let shortUrl in dataBase) {
    if (dataBase[shortUrl].userID === id) {
      result[shortUrl] = dataBase[shortUrl];
    }
  } return result;
};
module.exports = {generateRandomString, checkTheSameEmail, urlsForUser};