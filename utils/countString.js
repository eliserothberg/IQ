// var countString = 'sum(if(month = 01, 1, 0))  AS Jan, ' +
//  +'sum(if(month = 02, 1, 0))  AS Feb, ' +
//  +'sum(if(month = 03, 1, 0))  AS Mar, ' +
//  +'sum(if(month = 04, 1, 0))  AS Apr, ' +
//  +'sum(if(month = 05, 1, 0))  AS May, ' +
//  +'sum(if(month = 06, 1, 0))  AS Jun, ' +
//  +'sum(if(month = 07, 1, 0))  AS Jul, ' +
//  +'sum(if(month = 08, 1, 0))  AS Aug, ' +
//  +'sum(if(month = 09, 1, 0))  AS Sep, ' +
//  +'sum(if(month = 10, 1, 0)) AS Oct, ' +
//  +'sum(if(month = 11, 1, 0)) AS Nov, ' +
//  +'sum(if(month = 12, 1, 0)) AS "Dec" ' +
//  +'FROM Deals ' +
//  +'WHERE (dealStatus = "Deal Won (100%)" OR dealStatus = "Very Likely (90%)") '+
//  +'AND (newVersusReturning = ';
// module.exports = countString;