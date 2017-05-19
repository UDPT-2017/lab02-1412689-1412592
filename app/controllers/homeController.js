var homeController ={
	index: function(req, res){
		res.render('index', {
	  	title: '1412592-1412689',
	  	page: 'index',
	  	active: { home: true },
	  	user : req.user
	  })
	}
};

module.exports = homeController;
