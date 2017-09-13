const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user.js');
const bcrypt = require('bcrypt');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: true
}));

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */

const hash = (password, BCRYPT_COST) => {
  return bcrypt.hashSync(password, BCRYPT_COST);
};
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

// TODO: implement routes

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError("Please make a username or password", res);
    return;
  };
  const passwordHash = hash(password, BCRYPT_COST);
  const newUser = new User({username, passwordHash});
  newUser.save((err, savedUser) => {
    if(err){
      sendUserError(err, res);
      return;
    }
    res.json({savedUser});
  });
});

server.post('/log-in', (req, res) => {

});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
