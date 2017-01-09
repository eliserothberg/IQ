//this formats the data to be downloaded to a .xls file for excel
//and then writes that file to a temp file that gets overwritten 
//each time a new graph is chosen.

var fs = require('fs');
var jsonexport = require('jsonexport');

function forXLSexport (passEmp, thisType, title) {
  jsonexport(passEmp, { rowDelimiter: '\t' }, function(err, csv) {
    if (err) return console.log(err);
    var path = "excel.xls";
    var data = csv;
    //changes thisType to "placeholder" to delete in columns so the graph type will be available for the title.
    data = data.replace(new RegExp("\\b"+thisType+"\\b", "gi"), 'placeholder');
    //gets rid of "placeholder", "dataType" and "symbol"
    data = data.replace(/\b(placeholder|dataType|symbol)\b/gi, '');
    //gets rid of ":" and "$" by getting rid of everything but numbers and letters and commas
    //but this leaves two empty columns
    data = data.replace(/[^\w\s\,]/gi, '');
    //gets rid of two empty columns
    data = data.replace(/(\t\t)/gi, '');
      // console.log(data);
      //replace "label" with graph title
    data = data.replace(/\b(label)\b/gi, title)

    fs.writeFile(path, data, function(error) {
      if (error) {
        console.error("write error:  " + error.message);
      } else {

        console.log("Successful Write to " + path);
      }
    });
  });
}

module.exports = forXLSexport;