// var revenueString ='sum(if(month = 01, revenue, 0))  AS Jan, ' +
//  +'sum(if(month = 02, revenue, 0))  AS Feb, ' +
//  +'sum(if(month = 03, revenue, 0))  AS Mar, ' +
//  +'sum(if(month = 04, revenue, 0))  AS Apr, ' +
//  +'sum(if(month = 05, revenue, 0))  AS May, ' +
//  +'sum(if(month = 06, revenue, 0))  AS Jun, ' +
//  +'sum(if(month = 07, revenue, 0))  AS Jul, ' +
//  +'sum(if(month = 08, revenue, 0))  AS Aug, ' +
//  +'sum(if(month = 09, revenue, 0))  AS Sep, ' +
//  +'sum(if(month = 10, revenue, 0)) AS Oct, ' +
//  +'sum(if(month = 11, revenue, 0)) AS Nov, ' +
//  +'sum(if(month = 12, revenue, 0)) AS "Dec" ' +
//  +'FROM Deals ' +
//  +'WHERE (dealStatus = "Deal Won (100%)" OR dealStatus = "Very Likely (90%)") '+
//  +'AND (newVersusReturning = ';
// module.exports = revenueString;