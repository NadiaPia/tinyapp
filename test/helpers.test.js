
const { assert } = require('chai');

const {generateRandomString, checkTheSameEmail, urlsForUser} = require('../helpers.js');

const testUsers = {
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

describe('checkTheSameEmail', function() {
  it('should return the entire object with valid email inside', function() {
    const obj = checkTheSameEmail("q@a.z", testUsers);
    const expectedObj = testUsers.abc;
    assert.deepEqual(obj, expectedObj);
  });

  it('should return undefined if there is no the email in the dataBase ', function() {
    const actual = checkTheSameEmail("qwww@a.z", testUsers);
    const expected = false;
    assert.equal(actual, expected);
  });
});

describe('urlsForUser', function() {
  it('should return the entire object with valid userID inside', function() {
    const obj = urlsForUser("rty", urlDatabase);
    const expectedObj = {
      idfort: {
        longURL: "https://www.google.ca",
        userID: "rty"
      }
    };
    assert.deepEqual(obj, expectedObj);
  });

});

describe('generateRandomString', function() {
  it('should return the string of n alphanumeric characters long', function() {
    const string = generateRandomString(6);
    assert.equal(string.length, 6);
  });

});