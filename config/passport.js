// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model

var bcrypt = require('bcrypt-nodejs');
// load up the user model
var moment = require('moment');
var momentNow = moment();
var formatted = momentNow.format('YYYY-MM-DD HH:mm:ss');

const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'harmonicatabs2015@gmail.com',
        pass: 'harmonicatabs17101995'
    }
});

module.exports = function(passport, pool) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });
    //debug met vcl kkk

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            //copy ca dong nay vao trong project, roi edit cac file html lai.  sau do dung bt lka duoc con luot view n buaye
            pool.query("SELECT * FROM users WHERE email = '" + email + "'", function(err, rows) {
                if (err)
                    return done(err);
                if (rows.rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUser = {
                        username: req.body.username,
                        phone: req.body.phone,
                        email: email,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    //var insertQuery = ;

                    pool.query("INSERT INTO users ( username, password, phone, email  ) values ('"+ newUser.username+"','"+newUser.password+"', '"+newUser.phone+"', '"+newUser.email+"')",function(err, rows) {
                      //console.log();
                          if(err)
                            return done(err);
                        newUser.id = rows.result;
                        //done(err);
                        return done(null, newUser);
                    });

                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
          pool.query("SELECT * FROM users WHERE email = '" + email + "'", function(err, rows){
                if (err)
                {
                    return done(err);
                  }

                if (rows.rows.length == 0) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong

                if (!bcrypt.compareSync(password, rows.rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata


                let mailOptions = {
                    from: '"My Message 👻" <harmonicatabs2015@gmail.com>', // sender address
                    to: rows.rows[0].email, // list of receivers
                    subject: 'Hello ✔', // Subject line
                    text: 'Hello world ?', // plain text body
                    html: '<b>Hello world ?</b>' // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });
                // all is well, return successful user
                return done(null, rows.rows[0]);
            });
        })
    );
};
