// var Nightmare = require('nightmare');
// var should = require('chai').should();

// describe('Registered user logs in', function() {
//   this.timeout(60000);

//   var url = 'http://localhost:3000';

//   it('should go to log in page', function(done) {
//     var nightmare = new Nightmare({
//       show: true
//     });
//     nightmare
//       .goto(url)
//       .wait(1000)
//       .evaluate(function() {
//         return document.title;
//       })
//       .end()
//       .then(function(result) {
//         result.should.equal('Sales Chart');
//         done();
//       })
//       .catch(function(err) {
//         console.error("Go to log in not working");
//         done(err);
//       });
//   });

//   it('should go to graph page after login', function(done) {
//     var nightmare = new Nightmare({
//       show: true
//     });
//     nightmare
//       .goto(url)
//       .wait(1000)
//       .click('#em')
//       .wait(1000)
//       .type('#em', 'bob@gmail.com')
//       .type('#pass', 'bob')
//       .click('#button.btn.btn-default')
//       .wait(1000)
//       .evaluate(function() {
//         return document.querySelectorAll('label')[0].innerText;
//       })
//       .end()
//       .then(function(result) {
//         result.should.contain('START DATE');
//         done();
//       })
//       .catch(function(err) {
//         console.error("Log in not working");
//         done(err);
//       });
//   });
//   it('should go to addOrDelete users page after login as admin', function(done) {
//     var nightmare = new Nightmare({
//       show: true
//     });
//     nightmare
//       .goto(url)
//       .wait(1000)
//       .click('#em')
//       .wait('#em')
//       .type('#em', 'admin@admin.com')
//       .type('#pass', 'admin')
//       .click('#button.btn.btn-default')
//       .wait(1000)
//       .evaluate(function() {
//         return document.querySelectorAll('label')[1].innerText;
//       })
//       .end()
//       .then(function(result) {
//         result.should.contain('PASSWORD');
//         done();
//       })
//       .catch(function(err) {
//         console.error("Log in not working");
//         done(err);
//       });
//   });
// });
