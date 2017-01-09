var models = require('../models');
var deals = require('../lib/salesData.js');
var express = require('express');
var co = require('co');
var generate = require('node-chartist');

var router = express.Router();

router.get('/', function (req, res) {
	res.redirect('/');
});

module.exports = router;
