var connection = require('../connection/connection.js');
var Promise = require('bluebird');
var allData = require('../lib/salesData.js');


console.log('X********\nThe answer to life, the universe\n');

function clearDataDeals() {

  var queryString = 'DELETE FROM Deals';
  return Promise.resolve(connection.query(queryString, function(err, result) {
    // if error throw it
    if (err) throw err;
    // if no error call the callback function with the query results
    return;
  }));
}

clearDataDeals()
  .then(function() {
    console.log('X********and everything!');
    var queryString = 'DELETE FROM Salespeople';
    return Promise.resolve(connection.query(queryString, function(err, result) {
      // if error throw it
      if (err) throw err;
      // if no error call the callback function with the query results
      return;
    }));
  })
  .then(function() {
      console.log('\n*********42!\n');
      return allData();
  })
  .then(function() {    
      console.log('\n*********mice!\n');
      var queryString2 = 'UPDATE Deals INNER JOIN Salespeople ON Deals.salesperson = Salespeople.salesID ' +
        'SET Deals.salesName = Salespeople.salesName';
      connection.query(queryString2, function(err, result) {
        // if error throw it
        if (err) throw err;
        // if no error call the callback function with the query results
        return false;
      });
  });