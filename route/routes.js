// app/routes.js


var express  = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');



module.exports = function(app, passport, pool) {


	var homeController = require('../app/controllers/homeController');
	var messagesController = require('../app/controllers/messageController');
	var loginController = require('../app/controllers/loginController');

	app.use(express.static('public'));
	app.use('/components',express.static('bower_components'));

	//app.set('views', './views');
	// Register `hbs.engine` with the Express app.
	app.engine('hbs', exphbs({
	  extname: '.hbs',
		defaultLayout: 'application',
	  layoutsDir: path.resolve('./app/views/layouts/'),
	  partialsDir: path.resolve('./app/views/partials')
	}));

	app.set('view engine', 'hbs');
	app.set('views', path.resolve('././app/views'));

	app.get('/', homeController.index);


	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	/*app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});*/


	//albums
	//app.get("/messages/:id", messagesController.index);

//=======================================================================================================
	app.get('/messages', isLoggedIn, messagesController.messages);

	app.get('/api-mailbox', isLoggedIn, messagesController.apimailbox);


	app.get('/sentbox', isLoggedIn, messagesController.sentbox);

	app.get('/compose', isLoggedIn, messagesController.compose);

	//app.post('/compose', isLoggedIn, messagesController.postcompose);

	app.get('/read/:id', isLoggedIn, messagesController.read);


	app.get('/readsent/:id', isLoggedIn, messagesController.readsent);


	app.get('/users', function(req, res) {
		res.render('users',{
			title: '1412592-1412689',
			user: req.user,
			message: 'Trang cá nhân của bạn',
			layout: 'application',
			active: { users: true }
		});

	});

	//albums
	app.get('/about', function(req, res) {
		res.render('about',{
			user: req.user,
			title: '1412592-1412689',
			message: 'Thông tin về chúng tôi',
			layout: 'application',
			active: { about: true }
		}); // load the index.ejs file
	});
	//albums
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', Logged, loginController.formLogin);

	// process the login form
	app.post('/login', loginController.login);


	app.get('/signup', loginController.formSignup);


	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/messages', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash emailbox
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', loginController.logout);
};

// route middleware to make sure
	function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
function Logged(req, res, next) {

	// if user isnt authenticated in the session, carry on
	if (!req.isAuthenticated())
		return next();

	// if they are redirect them to the home page
	res.redirect('/');
}
