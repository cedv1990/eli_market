var express = require('express');
var session = require('express-session');
var app = express();
var router = express.Router();

app.use(session({ secret: '4pp-37iz4b3th', saveUninitialized: true, resave: true }));

var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
  sess = req.session;
  if (sess && sess.usuario){
    res.render('market', { title: 'La app de mamá Elizabeth', usuario: sess.usuario });
  }
  else {
    res.render('index', { title: 'La app de mamá Elizabeth' });
  }
});

router.post('/init', function(req, res, next) {
  sess = req.session;

  var usuario = req.body.user;
  sess.usuario = usuario;
  res.redirect('/');
});

router.get('/abandon', function(req, res, next) {
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    }
    else
    {
      res.redirect('/');
    }
  });

});

app.use(router);

module.exports = app;