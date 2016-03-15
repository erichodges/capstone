var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var path = require('path');

router.get('/', function(req, res, next) {
	console.log('we did it')
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
  //next();
});


module.exports = router;
