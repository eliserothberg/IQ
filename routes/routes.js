var express = require('express');
var router  = express.Router();
var Repopulate = require('../lib/repopulate.js');
var chartRevenue=require('../charts/chartRevenue.js');
var thisSymbol="$";
var allowed="";
var queryString='';
var revenueString = 'sum(if(month = 01, revenue, 0))  AS Jan, ' +
'sum(if(month = 02, revenue, 0))  AS Feb, ' +
'sum(if(month = 03, revenue, 0))  AS Mar, ' +
'sum(if(month = 04, revenue, 0))  AS Apr, ' +
'sum(if(month = 05, revenue, 0))  AS May, ' +
'sum(if(month = 06, revenue, 0))  AS Jun, ' +
'sum(if(month = 07, revenue, 0))  AS Jul, ' +
'sum(if(month = 08, revenue, 0))  AS Aug, ' +
'sum(if(month = 09, revenue, 0))  AS Sep, ' +
'sum(if(month = 10, revenue, 0)) AS Oct, ' +
'sum(if(month = 11, revenue, 0)) AS Nov, ' +
'sum(if(month = 12, revenue, 0)) AS "Dec" ' +
'FROM Deals ' +
'WHERE (dealStatus = "Deal Won (100%)" OR dealStatus = "Very Likely (90%)") '+
'AND (newVersusReturning = ';
var monthlyString = 'sum(if(month = 01, revenue, 0))  AS Jan, ' +
'sum(if(month = 02, revenue, 0))  AS Feb, ' +
'sum(if(month = 03, revenue, 0))  AS Mar, ' +
'sum(if(month = 04, revenue, 0))  AS Apr, ' +
'sum(if(month = 05, revenue, 0))  AS May, ' +
'sum(if(month = 06, revenue, 0))  AS Jun, ' +
'sum(if(month = 07, revenue, 0))  AS Jul, ' +
'sum(if(month = 08, revenue, 0))  AS Aug, ' +
'sum(if(month = 09, revenue, 0))  AS Sep, ' +
'sum(if(month = 10, revenue, 0)) AS Oct, ' +
'sum(if(month = 11, revenue, 0)) AS Nov, ' +
'sum(if(month = 12, revenue, 0)) AS "Dec" ' +
'FROM Deals ' +
'INNER JOIN Salespeople ' +
'ON Deals.salesperson=Salespeople.salesID ' +
'WHERE (dealStatus = "Deal Won (100%)" OR dealStatus = "Very Likely (90%)") '+
'AND (newVersusReturning = ';
var countString = 'sum(if(month = 01, 1, 0))  AS Jan, ' +
'sum(if(month = 02, 1, 0))  AS Feb, ' +
'sum(if(month = 03, 1, 0))  AS Mar, ' +
'sum(if(month = 04, 1, 0))  AS Apr, ' +
'sum(if(month = 05, 1, 0))  AS May, ' +
'sum(if(month = 06, 1, 0))  AS Jun, ' +
'sum(if(month = 07, 1, 0))  AS Jul, ' +
'sum(if(month = 08, 1, 0))  AS Aug, ' +
'sum(if(month = 09, 1, 0))  AS Sep, ' +
'sum(if(month = 10, 1, 0)) AS Oct, ' +
'sum(if(month = 11, 1, 0)) AS Nov, ' +
'sum(if(month = 12, 1, 0)) AS "Dec" ' +
'FROM Deals ' +
'WHERE (dealStatus = "Deal Won (100%)" OR dealStatus = "Very Likely (90%)") '+
'AND (newVersusReturning = ';

console.log('in routes.js');

router.get('/sign-in', function(req, res) {
  console.log('sign-in from the routes file');
  req.flash('info', 'Welcome');
  res.render('users/sign_in');
});

function isallowed(req){
  console.log('req: '+req);
  if (req==='admin'){
    allowed="admin";
  } else if (req==='basic'){
    allowed="basic";
  }
}

function completeQuery(newVersusReturning, startDate, endDate, dataType, topHeader, type){
      queryString = 'SELECT Deals.'+topHeader+', ';
      switch (type){
        case "revenue":
          queryString += revenueString;
          break;
        case "count":
          queryString += countString;
          break;
        case "monthly":
          queryString+= monthlyString;
          break;
      }   
  for (var i = 0; i < newVersusReturning.length; i++) {
    queryString += '"' + newVersusReturning[i] + '"';
    if (i < (newVersusReturning.length - 1)) {
      queryString += ' OR newVersusReturning = ';
    }
  }
  queryString += ') AND closeDate BETWEEN "' + startDate + '" AND "' + endDate + '" GROUP BY '+ dataType + ';';
}

router.post('/newRevenueProductLine', function(req, res) {
  isallowed(req.session.level);
  queryString = revenueString;
  console.log('New Revenue by product line from the routes file');
  console.log("req.session.level: "+req.session.level);
  var newVersusReturning = ["New Business", "Upsell/New Sale to Existing Project"];
  var title ="New Revenue by Product Line";
  var dataName = "Product Line";
  var dataType = "productLine";
  var yAxisTitle = "Sales ($USD)";
  console.log(req.body.startDate);
  console.log(req.body.endDate);
  completeQuery(newVersusReturning, req.body.startDate, req.body.endDate, dataType, dataType, 'revenue');
  if ((allowed==="admin")){
    chartRevenue.grabData(queryString, chartRevenue.logResults, title, dataName, res, thisSymbol, dataType, yAxisTitle, true, false, false);
    // allRevenueProductLine(title, dataName, conditions2,req.body.startDate,req.body.endDate, res, thisSymbol);
  } else {
    res.render('graphs/mainGraphPage', { info: 'Sorry, you do not have access to this graph: please choose another.'});
  };
});

router.post('/allRevenueProductLine', function(req, res) {
  isallowed(req.session.level);
  queryString = revenueString;
  console.log('All Revenue by product line from the routes file');
  console.log("req.session.level: "+req.session.level);
  var newVersusReturning = ["New Business", "Upsell/New Sale to Existing Project", "Returning Business", "blank"];
  var title ="All Revenue by Product Line";
  var dataName = "Product Line";
  var dataType = "productLine";
  var yAxisTitle = "Sales ($USD)";
  console.log(req.body.startDate);
  console.log(req.body.endDate);
  completeQuery(newVersusReturning, req.body.startDate, req.body.endDate, dataType, dataType, 'revenue');
  if (allowed==="admin"){
    chartRevenue.grabData(queryString, chartRevenue.logResults, title, dataName, res, thisSymbol, dataType, yAxisTitle, true, false, false);
    // allRevenueProductLine(title,dataName, conditions2,req.body.startDate,req.body.endDate, res, thisSymbol);
  } else {
    res.render('graphs/mainGraphPage', { info: 'Sorry, you do not have access to this graph: please choose another.'});
  };
});

router.post('/newRevenueSalesperson', function(req, res) {
  isallowed(req.session.level);
  queryString = revenueString;
  console.log('All Revenue by Salesperson from the routes file');
  console.log("req.session.level: "+req.session.level);
  var newVersusReturning = ["New Business", "Upsell/New Sale to Existing Project"];
  var title ="New Revenue by Salesperson";
  var dataName = "Salesperson";
  var dataType = "salesName";
  var yAxisTitle = "Sales ($USD)";
  console.log(req.body.startDate);
  console.log(req.body.endDate);
  completeQuery(newVersusReturning, req.body.startDate, req.body.endDate, dataType, dataType, 'revenue');
  if (allowed==="admin"){
    chartRevenue.grabData(queryString, chartRevenue.logResults, title, dataName, res, thisSymbol, dataType, yAxisTitle, true, false, false);
    // allRevenueSalesperson(title, dataName, conditions2,req.body.startDate,req.body.endDate, res, thisSymbol);
  } else {
    res.render('graphs/mainGraphPage', { info: 'Sorry, you do not have access to this graph: please choose another.'});

  }
});

router.post('/allRevenueSalesperson', function(req, res) {
  isallowed(req.session.level);
  queryString = revenueString;
  console.log('All Revenue by Salesperson from the routes file');
  console.log("req.session.level: "+req.session.level);
  var newVersusReturning = ["New Business", "Upsell/New Sale to Existing Project", "Returning Business", "blank"];
  var title ="All Revenue by Salesperson";
  var dataName = "Salesperson";
  var dataType = "salesName";
  var yAxisTitle = "Sales ($USD)";
  console.log(req.body.startDate);
  console.log(req.body.endDate);
  completeQuery(newVersusReturning, req.body.startDate, req.body.endDate, dataType, dataType, 'revenue');
  if (allowed==="admin"){
    chartRevenue.grabData(queryString, chartRevenue.logResults, title, dataName, res, thisSymbol, dataType, yAxisTitle, true, false, false);
    // allRevenueSalesperson(title, dataName, conditions2,req.body.startDate,req.body.endDate, res, thisSymbol);
  } else {
    res.render('graphs/mainGraphPage', { info: 'Sorry, you do not have access to this graph: please choose another.'});

  }
});

router.post('/newRevenueDealType', function(req, res) {
  isallowed(req.session.level);
  queryString = revenueString;
  console.log('New Revenue by Deal Type from the routes file');
  console.log("req.session.level: "+req.session.level);
  var newVersusReturning = ["New Business", "Upsell/New Sale to Existing Project"];
  var title ="New Revenue by Deal Type";
  var dataName = "Deal Type";
  var dataType = "dealType";
  var yAxisTitle = "Sales ($USD)";
  console.log(req.body.startDate);
  console.log(req.body.endDate);
  completeQuery(newVersusReturning, req.body.startDate, req.body.endDate, dataType, dataType, 'revenue');
  if (allowed==="admin"){
    chartRevenue.grabData(queryString, chartRevenue.logResults, title, dataName, res, thisSymbol, dataType, yAxisTitle, true, false, false);
    // allRevenueDealType(title, dataName, conditions2,req.body.startDate,req.body.endDate, res, thisSymbol);
  } else {
    res.render('graphs/mainGraphPage', { info: 'Sorry, you do not have access to this graph: please choose another.'});
  }
});

router.post('/allRevenueDealType', function(req, res) {
  isallowed(req.session.level);
  queryString = revenueString;
  console.log('All Revenue by Deal Type from the routes file');
  console.log("req.session.level: "+req.session.level);
  var newVersusReturning = ["New Business", "Upsell/New Sale to Existing Project", "Returning Business", "blank"];
  var title ="All Revenue by Deal Type";
  var dataName = "Deal Type";
  var dataType = "dealType";
  var yAxisTitle = "Sales ($USD)";
  console.log(req.body.startDate);
  console.log(req.body.endDate);
  completeQuery(newVersusReturning, req.body.startDate, req.body.endDate, dataType, dataType, 'revenue');
  if (allowed==="admin"){
    chartRevenue.grabData(queryString, chartRevenue.logResults, title, dataName, res, thisSymbol, dataType, yAxisTitle, true, false, false);
    // allRevenueDealType(title, dataName, conditions2,req.body.startDate,req.body.endDate, res, thisSymbol);
  } else {
    res.render('graphs/mainGraphPage', { info: 'Sorry, you do not have access to this graph: please choose another.'});
  }
});

router.post('/newRevenueVertical', function(req, res) {
  isallowed(req.session.level);
  queryString = revenueString;
  console.log('New Revenue by Vertical from the routes file');
  console.log("req.session.level: "+req.session.level);
  var newVersusReturning = ["New Business", "Upsell/New Sale to Existing Project"];
  var title ="New Revenue by Vertical";
  var dataName = "Vertical";
  var dataType = "vertical";
  var yAxisTitle = "Sales ($USD)";
  console.log(req.body.startDate);
  console.log(req.body.endDate);
  completeQuery(newVersusReturning, req.body.startDate, req.body.endDate, dataType, dataType, 'revenue');
  if (allowed==="admin"){
    chartRevenue.grabData(queryString, chartRevenue.logResults, title, dataName, res, thisSymbol, dataType, yAxisTitle, true, false, false);
    // allRevenueVertical(title, dataName, conditions2,req.body.startDate,req.body.endDate, res, thisSymbol);
  } else {
    res.render('graphs/mainGraphPage', { info: 'Sorry, you do not have access to this graph: please choose another.'});
  }
});

router.post('/allRevenueVertical', function(req, res) {
  isallowed(req.session.level);
  queryString = revenueString;
  console.log('All Revenue by Vertical from the routes file');
  console.log("req.session.level: "+req.session.level);
  var newVersusReturning = ["New Business", "Upsell/New Sale to Existing Project", "Returning Business", "blank"];
  var title ="All Revenue by Vertical";
  var dataName = "Vertical";
  var dataType = "vertical";
  var yAxisTitle = "Sales ($USD)";
  console.log(req.body.startDate);
  console.log(req.body.endDate);
  completeQuery(newVersusReturning, req.body.startDate, req.body.endDate, dataType, dataType, 'revenue');
  if (allowed==="admin"){
    chartRevenue.grabData(queryString, chartRevenue.logResults, title, dataName, res, thisSymbol, dataType, yAxisTitle, true, false, false);
    // allRevenueVertical(title, dataName, conditions2,req.body.startDate,req.body.endDate, res, thisSymbol);
  } else {
    res.render('graphs/mainGraphPage', { info: 'Sorry, you do not have access to this graph: please choose another.'});
  }
});

router.post('/newRevenueProductLineCount', function(req, res) {
  isallowed(req.session.level);
  queryString = countString;
  console.log('New Revenue by Product Line Count from the routes file');
  console.log("req.session.level: "+req.session.level);
  var newVersusReturning = ["New Business", "Upsell/New Sale to Existing Project"];
  var title ="New Revenue by Product Line (Count)";
  var dataName = "Product Line";
  var dataType = "productLine";
  var yAxisTitle = "Number of Deals";
  var thisSymbol="";
  console.log(req.body.startDate);
  console.log(req.body.endDate);
  completeQuery(newVersusReturning, req.body.startDate, req.body.endDate, dataType, dataType, 'count');
  if (allowed==="admin" || allowed==="basic") {
    chartRevenue.grabData(queryString, chartRevenue.logResults, title, dataName, res, thisSymbol, dataType, yAxisTitle, true, true, false);
    // allRevenueProductLineCount(title, dataName, conditions2,req.body.startDate,req.body.endDate, res, thisSymbol);
  } else {res.redirect('/graphs/mainGraphPage');}
});

router.post('/allRevenueProductLineCount', function(req, res) {
  isallowed(req.session.level);
  queryString = countString;
  console.log('All Revenue by Product Line Count from the routes file');
  console.log("req.session.level: "+req.session.level);
  var newVersusReturning = ["New Business", "Upsell/New Sale to Existing Project", "Returning Business", "blank"];
  var title ="All Revenue by Product Line (Count)";
  var dataName = "Product Line";
  var dataType = "productLine";
  var yAxisTitle = "Number of Deals";
  var thisSymbol="";
  console.log(req.body.startDate);
  console.log(req.body.endDate);
  completeQuery(newVersusReturning, req.body.startDate, req.body.endDate, dataType, dataType, 'count');
  if (allowed==="admin" || allowed==="basic") {
    chartRevenue.grabData(queryString, chartRevenue.logResults, title, dataName, res, thisSymbol, dataType, yAxisTitle, true, true, false);
    // allRevenueProductLineCount(title, dataName, conditions2,req.body.startDate,req.body.endDate, res, thisSymbol);
  } else {res.redirect('graphs/mainGraphPage');}
});

router.post('/newRevenueByMonth', function(req, res) {
  isallowed(req.session.level);
  queryString = monthlyString;
  console.log('New Revenue by Month from the routes file');
  console.log("req.session.level: "+req.session.level);
  var newVersusReturning = ["New Business", "Upsell/New Sale to Existing Project"];
  var title ="New Revenue by Month";
  var dataName = "Revenue";
  var dataType = "salesName";
  var yAxisTitle = "Sales ($USD)";
  var thisSymbol="$";
  console.log(req.body.startDate);
  console.log(req.body.endDate);
  completeQuery(newVersusReturning, req.body.startDate, req.body.endDate, dataType, 'salesperson, Salespeople.salesName', 'monthly');
  console.log(queryString);
  if (allowed==="admin" || allowed==="basic") {
    chartRevenue.grabData(queryString, chartRevenue.logResults, title, dataName, res, thisSymbol, dataType, yAxisTitle, false, false, true);
    // allRevenueByMonth(title, dataName, conditions2,req.body.startDate,req.body.endDate, res, thisSymbol);
  } else {res.redirect('graphs/mainGraphPage');}
});

router.post('/allRevenueByMonth', function(req, res) {
  isallowed(req.session.level);
  queryString = monthlyString;
  console.log('All Revenue by Month from the routes file');
  console.log("req.session.level: "+req.session.level);
  var newVersusReturning = ["New Business", "Upsell/New Sale to Existing Project", "Returning Business", "blank"];
  var title ="All Revenue by Month";
  var dataName = "Revenue";
  var dataType = "salesName";
  var yAxisTitle = "Sales ($USD)";
  var thisSymbol="$";
  console.log(req.body.startDate);
  console.log(req.body.endDate);
  console.log('allowed: '+allowed);
  completeQuery(newVersusReturning, req.body.startDate, req.body.endDate, dataType, 'salesperson, Salespeople.salesName', 'monthly');
  if (allowed==="admin" || allowed==="basic") {
    chartRevenue.grabData(queryString, chartRevenue.logResults, title, dataName, res, thisSymbol, dataType, yAxisTitle, false, false, true);
    // allRevenueByMonth(title, dataName, conditions2,req.body.startDate,req.body.endDate, res, thisSymbol);
  } else {res.redirect('graphs/mainGraphPage');}
});




module.exports = router;
