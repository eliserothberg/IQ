var request = require("request");
var Promise = require('bluebird');
var rp = require('request-promise');
var auth = require('../utils/key3.js');

var getNum;
var options;
var size;
var callNumber;
var URLcounter = 0;
var totalRecords;
//get the total number of records by querying for one record
var getNum = {
  method: 'GET',
  uri: 'https://api.salesforceiq.com/v2/lists/57114e10e4b0a3f93805ebc6/listitems?_start=0&_limit=1',
  headers: {
    'Authorization': auth,
    'Content-type': 'application/json'
  },
  json: true
};
//use promises in this function to do multiple API calls in a loop
function getData() {
  //use the number of records info from the first API call
  return rp(getNum)
    .then(function(ret) {
      // console.log("**from keys.js * totalSize = " + ret.totalSize);
      //determine the number of API calls needed
      size = ret.totalSize;
      callNumber = Math.ceil(size / 200);
      var requestPromiseArray = [];
      for (j = 0; j < callNumber; j++) {
        //create the requestPromiseArray using a loop
        options = {
          method: 'GET',
          uri: 'https://api.salesforceiq.com/v2/lists/57114e10e4b0a3f93805ebc6/listitems?_start=' + URLcounter + '&_limit=200',
          headers: {
            'Authorization': auth,
            'Content-type': 'application/json'
          },
          json: true
        }
        if (!options.uri) {}
        //push each call result into the array
        requestPromiseArray.push(rp(options));
        URLcounter = URLcounter + 200;
      }
      //return all the API calls
      return Promise.all(requestPromiseArray);        
    })
    .then(function(totalRecords) {
      //join the API calls into one array
      return totalRecords.reduce(function(initial, following) {
        return initial.concat(following.objects);
      }, []);
    })
    .catch(function(err) {
      console.log("error in API call")
    });
}

module.exports = getData;
