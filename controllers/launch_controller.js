var bcrypt = require('bcryptjs');
var models = require('../models');
var express = require('express');
var router = express.Router();

var app = express();
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

console.log("*** launch_controller");

var userId = 0;
var username = '';
var loggedIn = false;
var email = "";

// Display the login page
router.get('/', function(req, res) {
    var holder = [];
    // if session id defined, then set parameters to display graphs
    if (req.session.user_id != undefined) {
        userId = req.session.user_id;
        username = req.session.username;
        loggedIn = true;
        email = req.session.email;
    };

    if (userId == undefined || userId == 0) {
        res.render('./users/sign_in');
    } else {
        res.render('graphs/mainGraphPage');
    }
});
//allows the user to delete their account
router.post('/deleteaccount/', function(req,res) {
  //Delete event based on the id passed in the url
  if (userId==undefined || userId==0) {
    res.redirect('/');
  } else {
    models.User.destroy({
      where: {
        id: userId
      }
    })
    // redirect back to home page
    .then(function() {
      res.redirect('/');
    });
  }
});

module.exports = router;
