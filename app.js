// "starting point" in our code.
var React = require('react');
var ReactDOM = require('react-dom');

// Grab the property associated with the Router
var Router = require('react-router').Router;

// We are going to create a routes object 
var routes = require('./app/controllers/user_controller');

router.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    res.locals.messages = req.flash();
    next();
});

// ReactDOM.render((
//   <Router>{routes}</Router>),
// document.getElementById('app'))