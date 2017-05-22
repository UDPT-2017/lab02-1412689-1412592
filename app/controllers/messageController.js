/*var messagesController ={
	message: function(req, res){
		res.render('messages',{
			user: req.user,
			title: '1412592-1412689',
			layout: 'application',
			active: { messages: true }
		});
	}
};*/

var moment = require('moment');
var momentNow = moment();
var formatted = momentNow.format('YYYY-MM-DD HH:mm:ss');
const pool = require('../models/pg');

var messagesController = {
	message: function(req, res) {
		/*pool.connect(function (err) {
		  if (err) return console.log(err);
			  // execute a query on our database
			pool.query('select emailbox.id_email, title, content, read, send_time, read_time, username from emailbox,users where user_receive = '+ req.user.id +'and users.id = emailbox.user_send order by emailbox.id_email desc OFFSET 0 LIMIT 10', function (err, result) {
			    if (err) {
			    	res.end();
			    	return console.log(err);
			    }
			    pool.query('select count(*) from emailbox where user_receive = ' + req.user.id + ' and read = 0 group by user_receive', function (err, count) {
				    if (err) {
				    	res.end();
				    	return console.log(err);
				    }
				    pool.query('select count(*) from emailbox where user_receive = ' + req.user.id + ' group by user_receive', function (err, countAll) {
					    if (err) {
					    	res.end();
					    	return console.log(err);
					    }
					    // disconnect the client
						    // disconnect the client
						    // console.log(result.rows);
						    // console.log(countAll.rows);
						    // console.log(countAll.rows.length);
						    var countMailAll = 0;
						    if(countAll.rows.length > 0)
						    	countMailAll = countAll.rows[0].count;
						    var countMailRe = 0;
						    if(count.rows.length > 0)
						    	countMailRe = count.rows[0].count;*/
						    res.render('messages',{
								//received : result.rows,
								//friend: friend.rows,
								//countMailAll: countMailAll,
								//countMailRe: countMailRe,
								layout: 'application',
								active: { messages: true }
								//sentEmail: req.flash('sentEmail')[0]
							});
				/*	});
				});
			});


		});*/
	},
	apimailbox: function(req, res) {
		if (req.xhr || req.headers.accept.indexOf('json') > -1) {

			pool.connect(function (err) {
			  if (err) return console.log(err);
				  // execute a query on our database
				pool.query('select emailbox.id, title, content, read, send_time, read_time, username from emailbox,users where user_receive = '+ req.query.id +'and users.id = emailbox.user_send order by emailbox.id_email desc OFFSET 0 LIMIT ' + 10*req.query.page, function (err, result) {
				    if (err) {
				    	res.end();
				    	return console.log(err);
				    }
				    console.log("Ajax reload emailbox!");
				    res.end(JSON.stringify(result.rows));
				});



			});

			//console.log(req.body.id); -> for post
		}
	},
	sentbox: function(req, res) {
		pool.connect(function (err) {
		  if (err) return console.log(err);
			  // execute a query on our database
			  pool.query('select emailbox.id, title, content, read, send_time, read_time, username from emailbox,users where user_send = '+ + req.user.id +'and users.id = emailbox.user_receive order by emailbox.id_email desc', function (err, result) {
			    if (err) {
			    	res.end();
			    	return console.log(err);
			    }
			    pool.query('select count(*) from emailbox where user_send = ' + req.user.id + ' group by user_send', function (err, count) {
				    if (err) {
				    	res.end();
				    	return console.log(err);
				    }
				    // disconnect the client
				    pool.query('select count(*) from emailbox where user_receive = ' + req.user.id + 'and read = 0 group by user_receive', function (err, countRe) {
					    if (err) {
					    	res.end();
					    	return console.log(err);
					    }
					    // disconnect the client
					    pool.query('select * from friend, users where user_id = '+ req.user.id +' and friend_id = id', function (err, friend) {
						    if (err) {
						    	res.end();
						    	return console.log(err);
						    }
						    // disconnect the client
						    // console.log(result.rows)
						    // console.log(count.rows);
						    var countMail = 0;
						    if(count.rows.length > 0)
						    	countMail = count.rows[0].count;
						    var countMailRe = 0;
						    if(countRe.rows.length > 0)
						    	countMailRe = countRe.rows[0].count;
						    res.render('sentbox',{
								sent : result.rows,
								count: countMail,
								countMailRe: countMailRe,
								friend: friend.rows,
								sentEmail: req.flash('sentEmail')[0],
							});
						});
					});
				});
			});


		});
	},
	compose: function(req, res) {
		pool.connect(function (err) {
		  if (err) return console.log(err);
			  // execute a query on our database
			pool.query('select * from friend,users where user_id = '+ req.user.id +' and friend_id = users.id', function (err, result) {
			    if (err) {
			    	res.end();
			    	return console.log(err);
			    }
			    // disconnect the client
			    pool.query('select count(*) from emailbox where user_receive = ' + req.user.id + 'and read = 0 group by user_receive', function (err, count) {
				    if (err) {
				    	res.end();
				    	return console.log(err);
				    }
			    // disconnect the client
				    pool.query('select * from friend, users where user_id = '+ req.user.id +' and friend_id = id', function (err, friend) {
				    if (err) {
				    	res.end();
				    	return console.log(err);
				    }
				    // disconnect the client
					    //console.log(result.rows);
					    var countMailRe = 0;
						    if(count.rows.length > 0)
						    	countMailRe = count.rows[0].count;
					    res.render('compose',{
							friend_list : result.rows,
							countMailRe: countMailRe,
							friend: friend.rows,
						});
					});
				});
			});


		});
	},
	postcompose : function(req, res) {
		// console.log(req.body.receive_id);
		// console.log(req.body.sbjName);
		// console.log(req.body.content);

		pool.connect(function (err) {
		  if (err) return console.log(err);
		  console.log("Compose 1");
			  // execute a query on our database
			var insertQuery = "insert into emailbox(title,user_send,user_receive,content,read,send_time,read_time) values('" +
			        req.body.sbjName  +"','"+
			        req.user.id +"','"+
			        req.body.receive_id +"','"+
			        req.body.content +"',"+
			        0 +",'"+
			        formatted +
			        "',null)";
			pool.query(insertQuery, function (err, result) {
				console.log("Compose 2");
				if (err) {
					res.end();
					return console.log(err);
				}
				console.log("Compose 3");
				// disconnect the client
				req.flash('sentEmail', 'Oke fine! I am Done');
				res.redirect('/messages');
			});


		});
	},
	read: function(req, res) {
		pool.connect(function (err) {
		  if (err) return console.log(err);
			  // execute a query on our database
			pool.query('select * from emailbox,users where user_send = users.id and emailbox.id_email = '+ req.params.id, function (err, result) {
			    if (err) {
			    	res.end();
			    	return console.log(err);
			    }
			    // disconnect the client
			    pool.query('select count(*) from emailbox where user_receive = ' + req.user.id + 'and read = 0 group by user_receive', function (err, count) {
				    if (err) {
				    	res.end();
				    	return console.log(err);
				    }
			    // disconnect the client
				    pool.query('select * from friend, users where user_id = '+ req.user.id +' and friend_id = id', function (err, friend) {
				    if (err) {
				    	res.end();
				    	return console.log(err);
				    }
				    // disconnect the client
					    pool.query("update emailbox set read = 1, read_time = '"+ formatted + "' where id = " + req.params.id, function (err, update) {
					    if (err) {
					    	res.end();
					    	return console.log(err);
					    }
					    // disconnect the client
						    //console.log(result.rows);
						    var countMailRe = 0;
							    if(count.rows.length > 0)
							    	countMailRe = count.rows[0].count;
						    res.render('reademail',{
								email : result.rows[0],
								countMailRe: countMailRe,
								friend: friend.rows,
							});
						});
					});
				});
			});


		});
	},
	readsent:  function(req, res) {
		pool.connect(function (err) {
		  if (err) return console.log(err);
			  // execute a query on our database
			pool.query('select * from emailbox,users where user_receive = users.id and emailbox.id_email = '+ req.params.id, function (err, result) {
			    if (err) {
			    	res.end();
			    	return console.log(err);
			    }
			    // disconnect the client
			    pool.query('select count(*) from emailbox where user_receive = ' + req.user.id + 'and read = 0 group by user_receive', function (err, count) {
				    if (err) {
				    	res.end();
				    	return console.log(err);
				    }
			    // disconnect the client
				    pool.query('select * from friend, users where user_id = '+ req.user.id +' and friend_id = id', function (err, friend) {
					    if (err) {
					    	res.end();
					    	return console.log(err);
					    }
					    // disconnect the client

						    // disconnect the client
							    //console.log(result.rows);
					    var countMailRe = 0;
						    if(count.rows.length > 0)
						    	countMailRe = count.rows[0].count;
					    res.render('readsent',{
							email : result.rows[0],
							countMailRe: countMailRe,
							friend: friend.rows,
						});

					});
				});
			});


		});
	},


}

module.exports = messagesController;
