var bcrypt = require('bcryptjs');
var models = require('../models');
var express = require('express');
var router = express.Router();
var admin = false;
var app = express();
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// login
router.post('/login', function(req, res) {
  console.log('at the login');
  console.log(req.body.email);
  return models.User.findOne({
    where: { email: req.body.email }
  }).then(function(user) {
    console.log('at the sign in');
    // console.log(user);
    if (user === null) {
      console.log('the user is null');
      // return res.send('Sorry- this user is not in the system.\nPlease hit the back button on your browser and try again.')
      res.render('sign_in', { info: 'This user is not in the system: please try again'});
      return;
    }
    console.log('at the bcrypt');
    // bcrypt compares user's password input with stored hash
    // if (password_hash == null) {
    //   password_hash = 'invalid';
    // }
    bcrypt.compare(req.body.password, user.password_hash, function(err, result) {
      if (result == true) {
        console.log('in bcrypt');
        console.log(req.body.email);
        // we save the logged in status user id and email to the session
        req.session.logged_in = true;

        // req.session.username = req.body.email;
        req.session.level = user.level;
        req.session.user_id = user.id;
        userId = user.id;
        req.session.email = user.email;
        if (req.session.level === 'admin') {
          console.log('setting the permission');
          admin = true;
        }
        if (req.body.email === 'admin@admin.com') {
          console.log('about to create');
          res.redirect('/users/addOrDelete');
        } else {
          res.redirect('/launch');
        }
      }
      // if password invalid
      else if (result == false || password_hash == null) {
        res.render('sign_in', { info: 'This password is invalid: please try again.'})
          // res.redirect('/')
      }
    });
  })
});
router.get('/addOrDelete', function(req, res) {
  res.render('users/addOrDelete');
});
// register a user
router.post('/create', function(req, res) {
  console.log('at the create users');
  console.log(req.body.email);
  return models.User.findAll({
      where: { email: req.body.email }
    })
    .then(function(users) {
      console.log('checked users');
      console.log(users.length);
      if (users.length > 0) {
        console.log(users)
        res.render('users/addOrDelete', { info: 'This email is already registered.'})
          // res.redirect('/users/addOrDelete')
          //need to send them back to the create page
      } else {
        console.log('creating the bcrypt');
        // Use bcrypt to generate a 10-round salt and then hash the user's password.
        return bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
            // create new user and store info
            return models.User.create({
                username: req.body.username,
                email: req.body.email,
                password_hash: hash,
                level: req.body.level
              })
              .then(function(user) {
                //enter the user's session by setting properties to req.
                // and save the logged in status to the session
                req.session.logged_in = true;
                req.session.username = user.username;
                // req.session.user_id = user.id;
                req.session.email = user.email;
                // redirect to home on login
                res.render('users/addOrDelete', { info: 'New user successfully created.'})

              });
          });
        });
      }
    })
})
router.get('/sign-out', function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  })
});
router.post('/delete', function(req, res) {
  models.User.destroy({
    where: {
      email: req.body.email,
    }

  }).then(function(user) {
    if (!req.body.id) {
      res.render('users/addOrDelete', { info: 'User successfully deleted.'})
    }
  });
});
module.exports = router;
