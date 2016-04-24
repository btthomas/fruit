;(function(){
'use strict';

const express = require('express');
const router = express.Router();
const await = require('await');
const fs = require('fs');
const api = require('./api');

router.get('/', function(req, res){
	console.error('route: /, ip: %s, time: %s', req.ip, new Date().toTimeString().substr(0,9));

  res.render('index');
}); 

router.use('/api', api);

module.exports = router;
})();