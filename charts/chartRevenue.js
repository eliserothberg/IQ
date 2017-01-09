var connection = require('../connection/connection.js')
var co = require('co');
var generate = require('node-chartist');
var jsonexport = require('jsonexport');
var fs = require('fs');
var arraySort = require('array-sort');
var forCSVexport = require('../utils/export.js');
var clearFile = require('../utils/clearFile.js');

var dataFunctions = {
	grabData:function(tableInput, cb, res, title, dataName, thisSymbol, dataType, yAxisTitle, reverse, count, monthfl){
	  // queryString holds query for mysql:
	  connection.query(tableInput, function(err, result) {
	    // if error throw it
	    if (err) throw err;
	    // if no error call the callback function with the query results
	    cb(result, res, title, dataName, thisSymbol, dataType, yAxisTitle, reverse, count, monthfl);
  		});
	},
	logResults:function(result, title, dataName, res, thisSymbol, dataType, yAxisTitle, reverse, count, monthfl){
	  var monthlytotal = [0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.];
	  var dataTypeTotal = [];
  	  var productLineTotal = [];
	  var months = Object.keys(result[0]);
	  months.shift();
	  if (monthfl){
	  	months.shift();
	  }
	  var passEmp = [];
	  var graphMonth = [];
	  var labels = [];
	  var max = 0;
	  var annualTotal = 0;
	  for (var i = 0; i < result.length; i++) {
	    labels[i] = result[i][dataType];
	    // var pos = labels[i].indexOf('(');
	    // if (pos > 0) {
	    //   var inter = labels[i].substring(0, (pos - 1));
	    //   labels[i] = inter;
	    // }
	    var total = 0;
	    var individual = {};
	    var values = [];
	    individual.label = labels[i];
	    individual.dataType = dataName;
	    individual.symbol = thisSymbol;

	    for (var j = 0; j < months.length; j++) {
	      if (count){
		      individual[months[j]] = result[i][months[j]].toFixed(0);
	      }else {
		      individual[months[j]] = result[i][months[j]].toLocaleString();
		  }
	      total += result[i][months[j]];
	      monthlytotal[j] += result[i][months[j]];
	      annualTotal += result[i][months[j]];
	    }
	    for (var k = 0; k < months.length; k++) {
	      values[k] = individual[months[k]];
	    }
	    if (monthfl){
    		individual.total = total.toLocaleString();
	    }else {
	    	individual.total = total;
	    }
	    passEmp.push(individual);
	    dataTypeTotal.push(total);
    	productLineTotal.push(total);

    	if (!monthfl){
		    if (total > max) {
		      max = total
		    }; 		
    	}

	    var passMonth = [];

	    for (var l = 0; l < months.length; l++) {
	      var intermediate = {};
	      intermediate.month = months[l];
	      if (count){
      		  intermediate.total = monthlytotal[l].toFixed(0);
	      }else if (monthfl){
      		  intermediate.total = monthlytotal[l].toLocaleString();
	      }else {
		      intermediate.total = monthlytotal[l];
		  }
	      intermediate.symbol = thisSymbol;
	      passMonth.push(intermediate);
	    }
	    graphMonth.push(values);
	  }

	  if (!monthfl){
	  	var sortEmp = arraySort(passEmp, "total", {reverse:reverse}); 	
	  	passEmp = sortEmp;
	  }

	  var totalMonthly = {};
	  totalMonthly.label = "Total: ";
	  totalMonthly.dataType = dataName;
	  totalMonthly.symbol = thisSymbol;

	  for (var o = 0; o < months.length; o++) {
	  	if (count){
    		totalMonthly[months[o]] = monthlytotal[o];
	  	}else {
		    totalMonthly[months[o]] = monthlytotal[o].toLocaleString();
		}
	  }
	  if (count){
  		  totalMonthly.total = annualTotal.toFixed(0);
	  }else {
		  totalMonthly.total = annualTotal.toLocaleString();
	  }
	  if (monthfl){
		  passEmp = [];
		  passEmp[0] = totalMonthly;
	  }else {
	  	passEmp.push(totalMonthly);
	  }

	  if (monthfl){
		  for (var i = 0; i < months.length; i++) {
		    if (monthlytotal[i] > max) { max = monthlytotal[i] };
		  }
	  }

	  max = max * 1.05;
	  co(function*() {
	    var options = {
	      high: max,
	      low: 0,
	      width: 1200,
	      height: 600,
	      seriesBarDistance: 15,
	      axisX: { title: dataName, offset: 50 },
	      axisY: { title: yAxisTitle, offset: 100 },
	      distributeSeries: true
	    };
	    var series = [];
	    if (monthfl){
    		var labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	    }
	    var categories = [];
	    var sortedClasses = [];
	    var sortedAmounts = [];
	    if (count){
		    for (var n = 0; n < sortEmp.length - 1; n++) {
	    	  var amounts = {};
		      sortedClasses.push(sortEmp[n].label.split('(')[0]);
		      amounts.name=sortEmp[n].label;
		      amounts.value=sortEmp[n].total;
		      sortedAmounts.push(amounts);
		    }
		    var bar = yield generate('bar', options, {
			    labels: sortedClasses,
			    series: sortedAmounts
    		});

	    }else if (monthfl){
		    for (var m = 0; m < result.length; m++) {
		      var serobj = {};
		      serobj.name = labels[m];
		      serobj.value = monthlytotal[m];
		      series.push(serobj);
			}
		    var bar = yield generate('bar', options, {
		      labels: labels,
		      series: series
		    });
		    var passData = [];
		    for (var y = 0; y < series.length; y++) {
		      series[y].value = series[y].value.toLocaleString();
		      var inter = {};
		      inter.value = series[y].value.toLocaleString();
		      passData.push(inter);
		    }
	    }else {
		    for (var m = 0; m < result.length; m++) {
		      var serobj = {};
		      var types = {};
		      serobj.name = passEmp[m].label;
		      serobj.value = passEmp[m].total;
		      if (dataType === 'salesName'){
				types = passEmp[m].label.split(' ')[1];
		      }else {	      	
			    types = passEmp[m].label.split('(')[0];
		      }
		      categories.push(types);
		      series.push(serobj);
		    }
		    var bar = yield generate('bar', options, {
		      labels: categories,
		      series: series
		    });
		    for (var n = 0; n < passEmp.length; n++) {
		    	passEmp[n].total = passEmp[n].total.toLocaleString();
		  	}
		}
	  	var thisType = dataName;
			//function to send information to xls file
	  	forCSVexport(passEmp, thisType, title);
	  	//function that wipes the xls file after five minutes
	  	setTimeout(clearFile, 300000);
	  	
	    res.render('./graphs/mainGraphPage', {
	      bar,
	      months: passMonth,
	      descriptor: passEmp,
	      title: title,
	      dataName: dataName
	    });
	  });		
	}
}

module.exports = dataFunctions;