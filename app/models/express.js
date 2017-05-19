module.exports = function(app, morgan, cookieParser, bodyParser, express, passport, flash, session){
  app.use(morgan('dev')); // log every request to the console
  app.use(cookieParser()); // read cookies (needed for auth)
  app.use(bodyParser.urlencoded({
  	extended: true
  }));
  app.use(bodyParser.json());

  // required for passport
  app.use(session({
  	secret: 'vidyapathaisalwaysrunning',
  	resave: true,
  	saveUninitialized: true
   } )); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session
  app.use(function(req,res,next){
        res.locals = ({
            user: req.user
        });
        return next();
    });

}
