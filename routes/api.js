;(function(){
'use strict';

const express = require('express');
const router = express.Router();
const await = require('await');
const fs = require('fs');
const request = require('request');

router.get('/data', function(req, res){
	console.error('route: /api/data, ip: %s, time: %s', req.ip, new Date().toTimeString().substr(0,9));
  
  //url 
  const url = 'http://di-interview-project.elasticbeanstalk.com/assignments/fruit/data?email=blaketaylorthomas@gmail.com';
  request(url, function(error, response, html) {
    if(error) {
      console.error('bad request', error);
      res.json(error);
    } else {
      res.json(JSON.parse(html));
    }
  });
});


module.exports = router;
})();