/*
File:       user.ejs
Name:       Ziyan Liu
Student Id: 301133339
Date:       2022-10-01
*/
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
