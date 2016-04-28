;(function(){
'use strict';

const express = require('express');
const router = express.Router();
const request = require('request');
// const fs = require('fs');

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
      
      //save this to the disk
      // save(html);
    }
  });
});

function save(longString) {
  
  fs.writeFile('data.json', longString, function(err) {
    if(err) {
      console.log('err');
    } else {
      console.log('success');
    }
  });
}

module.exports = router;
})();