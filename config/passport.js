// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model

var bcrypt = require('bcrypt-nodejs');
// load up the user model
const pg = require('pg');
var bcrypt = require('bcrypt-nodejs');

var config = {
  user: 'postgres', //env var: PGUSER
  database: 'users', //cái này tức là tên của database đã tạo
  password: '24081995', //password database
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);
module.exports = function(passport) {

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
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            //copy ca dong nay vao trong project, roi edit cac file html lai.  sau do dung bt lka duoc con luot view n buaye
            //bye bye. m lam dc view chua
            pool.query("SELECT * FROM user_table WHERE username = '" + username + "'", function(err, rows) {
                if (err)
                    return done(err);
                if (rows.rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    //var insertQuery = ;

                    pool.query("INSERT INTO user_table ( username, password ) values ('"+ newUserMysql.username+"','"+newUserMysql.password+"')",function(err, rows) {
                      //console.log();
                        newUserMysql.id = rows.result;
                        //done(err);
                        return done(null, newUserMysql);
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
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
          pool.query("SELECT * FROM user_table WHERE username = '" + username + "'", function(err, rows){
                if (err)
                {
                   console.log('err');
                    return done(err);
                  }
                // loi o day thi phai
                console.log(rows.rows.length);
                if (rows.rows.length == 0) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                console.log(rows.rows[0]);
                if (!bcrypt.compareSync(password, rows.rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                console.log('here');
                // all is well, return successful user
                return done(null, rows.rows[0]);
            });
        })
    );
};
