var auth = require('../utils/key3.js');
var request = require("request");
var Promise = require('bluebird');

function getList () {
  var theList = { method: 'GET',
    url: 'https://api.salesforceiq.com/v2/lists/57114e10e4b0a3f93805ebc6',
    headers: 
     { 
       'Authorization': auth,
       'Content-type': 'application/json'
     },
   
    json: true
  };

  return Promise.promisify(request)(theList)
  .then(function(res) {
    return res.body;
  });
};
module.exports = getList;