var request = require("request");
var Promise = require('bluebird');
var rp = require('request-promise');
var Deals = require('../models')["Deals"];
var Salespeople = require('../models')["Salespeople"];
var getList = require('../utils/key2.js');
var options = require('../utils/key.js');
var totalRecords = require('../utils/key.js');
var getData = require('../utils/key.js');
var auth = require('../utils/key3.js');
var moment = require("moment");
moment().format();

// counter for each campaign
var counter = 1;
var URLcounter;
var size;
var salesID;
var name;
var owner;
var dealStatus;
var revenue;
var newVersusReturning;
var dealType;
var productLine;
var closeDate;
var totals;
var thisRevenue;
var vertical;
var month;
var country;
var thisName;

function allData() {

  //use all returned records from multiple API calls in key.js
  return getData()
    .then(function(totalRecords) {
      //use categories from keys2.js API call
      return getList().then(function(category) {
        var dealList = [];
        for (var i = 0; i < totalRecords.length; i++) {
          //handle missing information from records
          var deal = {};

          function getOrElse(obj, def) {
            if (!obj) {
              return def;
            } else {
              return obj;
            }
          }

          function getOrElseFields(obj, def) {
            if (!obj) {
              return def;
            } else {
              return obj[0].raw;
            }
          }

          var thisItem = totalRecords[i];
          campaignID = getOrElse(thisItem.id, "Unspecified");
          name = getOrElse(thisItem.name, "Unspecified");
          dealStatus = getOrElseFields(thisItem.fieldValues[0], "Unspecified");
          salesperson = getOrElseFields(thisItem.fieldValues[1], "Unspecified");
          revenue = getOrElseFields(thisItem.fieldValues[3], 0);
          newVersusReturning = getOrElseFields(thisItem.fieldValues[17], "Unspecified");
          revenue = getOrElseFields(thisItem.fieldValues[3], 0);
          dealType = getOrElseFields(thisItem.fieldValues[44], "Unspecified");
          vertical = getOrElseFields(thisItem.fieldValues[18], "Unspecified");
          productLine = getOrElseFields(thisItem.fieldValues[45], "Unspecified");
          country = getOrElseFields(thisItem.fieldValues[47], "USA");
          dateCreate = getOrElseFields(thisItem.fieldValues.process_created_date, "Unspecified");
          dateClose = getOrElseFields(thisItem.fieldValues.process_close_date, "Unspecified");

          //error handling for strict sql
          if (dateClose == "Unspecified") {
            closeDate == "Unspecified";
          } else {
            closeDate = moment.unix(dateClose / 1000).format("YYYY-MM-DD");
          }
          if (dateCreate == "Unspecified") {
            createDate == "Unspecified";
          } else {
            createDate = moment.unix(dateCreate / 1000).format("YYYY-MM-DD");
          }
          if (dateClose == "Unspecified") {
            month == "Unspecified";
          } else {
            month = moment.unix(dateClose / 1000).format("MM");
          }
          //make information part of deal object
          deal.dealStatus = dealStatus;
          deal.campaignID = campaignID;
          deal.name = name;
          deal.salesperson = salesperson;
          deal.closeDate = closeDate;
          deal.createDate = createDate;
          deal.month = month;
          deal.newVersusReturning = newVersusReturning;
          deal.revenue = revenue;
          deal.dealType = dealType;
          deal.vertical = vertical;
          deal.productLine = productLine;
          deal.country = country;

          var type;

          //correlate IDs and categories from records and catergory list
          for (j = 0; j < category.fields.length; j++) {
            thisName = category.fields[j].id;

            function filterById(choice, id) {
              var choice = category.fields[j].listOptions;
              return choice.filter(function(choice) {
                return (choice['id'] == id);
              })[0];
            }

            if (thisName == "18") {
              if (theChoice = filterById(category['choice'], vertical)) {
                deal.vertical = theChoice.display;
              }
            }

            if (thisName == "0") {
              if (theChoice = filterById(category['choice'], dealStatus)) {
                deal.dealStatus = theChoice.display;
              }
            }

            if (thisName == "17") {
              if (theChoice = filterById(category['choice'], newVersusReturning)) {
                deal.newVersusReturning = theChoice.display;
              }
            }

            if (thisName == "45") {
              if (theChoice = filterById(category['choice'], productLine)) {
                deal.productLine = theChoice.display;
              }
            }

            if (thisName == "44") {
              if (theChoice = filterById(category['choice'], dealType)) {
                deal.dealType = theChoice.display;
              }
            }
          }

          // console.log("\nStatus: " + deal.dealStatus);
          // console.log("Campaign ID#: " + campaignID);
          // console.log("Name: " + name);
          // console.log("Sales Lead: " + salesperson);
          // console.log("Process Create Date: " + createDate);
          // console.log("Process Close Date: " + closeDate);
          // console.log("Month: " + month);
          // console.log("Revenue: $" + revenue);
          // console.log("Deal Type: " + deal.dealType);
          // console.log("New Versus Returning: " + deal.newVersusReturning);
          // console.log("Vertical: " + deal.vertical);
          // console.log("Product Line: " + deal.productLine);
          // console.log("Country: " + deal.country);
          // console.log("\n**Counter = " + counter);
          // console.log("----------------------------------------------------");
          // console.log("deal #" + i + " = " + JSON.stringify(deal) + "\n");
          counter++;
          //push deal object to deals table in database
          dealList.push(Deals.create(deal));
        }
        return Promise.all(dealList);
      })
      .then(function() {
        //remove multiples of salespeople IDs, push into new array
        var promiseList = [];
        var uniqueSalesperson = {};
        var newSalesperson = [];
        var bob = {};

        for (var i = 0; i < totalRecords.length; i++) {
          theSalesperson = totalRecords[i].fieldValues[1][0].raw;
          newSalesperson.push(totalRecords[i].fieldValues[1][0].raw);
        }
        var uniqueSalesperson = newSalesperson.filter(function(elem, pos) {
          return newSalesperson.indexOf(elem) == pos;
        });
        // console.log("--Salespeople length = " + uniqueSalesperson.length);
        // console.log("--Salespeople array = " + uniqueSalesperson);

        //match IDs to names from user table in API
        for (var i = 0; i < uniqueSalesperson.length; i++) {
          var eachID = uniqueSalesperson[i];
          var p = rp.get({
              uri: 'https://api.salesforceiq.com/v2/users/' + eachID,
              headers: {
                'Authorization': auth,
                'Content-type': 'application/json'
              },
              json: true
            })
            .then(function(person) {
              var salesPerson = {
                salesID: person.id,
                salesName: person.name
              };
              // push unique salespeople to Salespeople table in database
              return Salespeople.create(salesPerson);
              // console.log(salesPeople.salesName);
              // console.log(salesPeople.salesID);
              // console.log("salesPeople = " + JSON.stringify(salesPerson) + "\n");
            })
            .catch(function(err) {
              // console.log("A salesID no longer correlates to an employee.\n")
            });
          promiseList.push(p);
        }
        return Promise.all(promiseList);
      })
      .then(function() {
        // console.log("we inserted sales people!");
      });
    });
}

module.exports = allData;
