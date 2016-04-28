;(function(){
'use strict';

const express = require('express');
const router = express.Router();
const await = require('await');
const fs = require('fs');
const api = require('./api');

router.use('/api', api);

module.exports = router;
})();