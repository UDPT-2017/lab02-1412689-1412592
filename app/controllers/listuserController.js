

const pool = require('../models/pg');

var listuserController = {
  listusers:function(req,res){
      pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }

      //use the client for executing the query
      client.query('SELECT * FROM users ORDER BY id ASC', function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          res.end();
          return console.error('error running query', err);
        }
        //console.log(result.rows[0].number);
        res.render("listusers",{
          danhsach:result,
          title: '1412592-1412689',
    			user: req.user,
    			layout: 'application',
    			active: { listusers: true }
        });
        //output: 1
      });
    });

  }

} ;
module.exports = listuserController;
