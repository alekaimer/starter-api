"use strict";

const md5 = require("md5");

const passwordCrypter = (password) => {
  return md5(password + global.SALT_KEY);
};

module.exports = passwordCrypter;
