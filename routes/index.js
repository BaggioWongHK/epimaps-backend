var express = require('express');
var router = express.Router();
var https = require('https');
var fs = require('fs');
var cheerio = require('cheerio');
const URL = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
