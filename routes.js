// app/routes.js
module.exports = function(app, passport) {

	var express  = require('express');
	var exphbs  = require('express-handlebars');
	app.use(express.static('public'));
	app.use('/components',express.static('bower_components'));

	//app.set('views', './views');
	// Register `hbs.engine` with the Express app.
	app.engine('hbs', exphbs({
		extname: '.hbs'
	}));

	app.set('view engine', 'hbs');

	

	app.get('/', function (req, res) {
	  res.render('index', { 
	  	title: '1412592-1412689', 
	  	layout: 'application',
	  	active: { home: true },
	  	user : req.user
	  })
	});


	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	/*app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});*/


	//albums
	app.get('/messages', function(req, res) {
		res.render('messages',{
			user: req.user,
			title: '1412592-1412689', 
			message: 'Your message',
			layout: 'application',
			active: { messages: true }
		});

	});
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
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render("login", { message: req.flash('loginMessage'), title: '1412592-1412689',  });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', //nếu thành công thì chuyển về link nào đó.
            failureRedirect : '/login', // ko thì nó sẽ tự reload
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/',{
					user: req.user //truyền biến thông tin user vừa đăng ký về trang chủ	
				});
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup', { message: req.flash('signupMessage'),title: '1412592-1412689', });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
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
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
		});
	};

// route middleware to make sure
	function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
