var mongoose = require('mongoose');
var Member = mongoose.model('Member');
var Job = mongoose.model('Job');

exports.login_view = function(req, res) {
	if(req.session.logged) {
		res.redirect('/');
		return;
	}
	res.render('login');
};

exports.login = function(req, res){

	if(req.body.type == "login"){
		Member.find({Username: req.body.username, Password: req.body.password}, function(err, members){
			if(members.length != 0) {
				req.session.name = members[0].Name;
				req.session.username = req.body.username;
				req.session.password = req.body.password;
				req.session.logged = true;
				res.redirect('/');
			}else{
				res.render('login');
			}
		});
		
	}else if(req.body.type == "registeration"){

		Member.find({$or: [{Username: req.body.username}, {Name: req.body.name}]}, function(err, members){
			if(members.length == 0) {
				new Member({
					Name: req.body.name,
					Username: req.body.username,
					Password: req.body.password
				}).save(function(){
					req.session.name = req.body.name;
					req.session.username = req.body.username;
					req.session.password = req.body.password;
					req.session.logged = true;
					res.redirect('/');
				});
			}else{
				res.render('login');
			}
		});

	}else{
		res.render('login');
	}
	return;
};

exports.logout = function(req, res) {
	req.session.username = ''
	req.session.password = ''
	req.session.name = ""
	req.session.logged = false;
	res.redirect('/');
};


exports.search_view = function(req, res){
	res.locals.name = req.session.name;
	res.locals.username = req.session.username;
	res.locals.password = req.session.password;
	var locations = [];
	var RejectedDisabilities = [];
	Job.find(function(err, jobs){  	
		for(var i in jobs){
			if(!locations.includes(jobs[i].Location.trim())){
				locations.push(jobs[i].Location.trim());
			}
			for(var j in jobs[i].RejectedDisabilities){
				if(!RejectedDisabilities.includes(jobs[i].RejectedDisabilities[j].trim())){
					RejectedDisabilities.push(jobs[i].RejectedDisabilities[j].trim());
				}
				
			}

		}
		res.render('search', { 
			locations: locations,
			RejectedDisabilities: RejectedDisabilities
		});
	});

};

exports.search = function(req, res){
	res.locals.name = req.session.name;
	res.locals.username = req.session.username;
	res.locals.password = req.session.password;

	var keys = {
		$text: {$search: req.body.keyword}
	};
	var locations = req.body.location.split("|").filter(n => n);
	if (locations.length > 0){
		keys["Location"] = {"$in": locations};
	}
	var disabilities = req.body.disabilities.split("|").filter(n => n);
	if (disabilities.length > 0){
		keys["RejectedDisabilities"] = {"$nin": disabilities};
	}
	Job.find(keys, function(err, jobs){  	
		res.render('search_results', { 
			jobs: jobs
		});
	});
};
  
exports.view_a_job = function(req, res){
	Job.find({_id: req.params.jobId}, function(err, jobs){
		if(err || jobs.length == 0) {
			res.redirect('/search');
			return;
		} else {
			res.render('view_a_job', { 
				job: jobs[0]
			});
		}
	});
};

exports.profile = function(req, res){
	if(!req.session.logged) {
		res.redirect('/login');
		return;
	}
	res.locals.name = req.session.name;
	res.locals.username = req.session.username;
	res.locals.password = req.session.password;
	Job.find({Author: {"$in": [req.session.username, req.session.name]}}, function(err, jobs){  	
		res.render('profile', { 
			jobs: jobs
		});
	});
};

exports.update_a_job_view = function(req, res){
	if(!req.session.logged) {
		res.redirect('/');
		return;
	} 	
	res.locals.name = req.session.name;
	res.locals.username = req.session.username;
	res.locals.password = req.session.password;
	Job.find({_id: req.params.jobId}, function(err, jobs){
		if(err || jobs.length == 0 || jobs[0].Author != req.session.name) {
			res.redirect('/profile');
			return;
		} else {
			res.render('update_a_job', { 
				job: jobs[0]
			});
		}
	});
};

exports.update_a_job = function(req, res){
	if(!req.session.logged) {
		res.redirect('/');
		return;
	} 	
	res.locals.name = req.session.name;
	res.locals.username = req.session.username;
	res.locals.password = req.session.password;
	Job.find({_id: req.params.jobId}, function(err, jobs){
		if(err) {
			res.redirect('/profile');
			return;
		} else {
			if(req.body.type == "delete"){
				Job.deleteMany({_id: req.params.jobId}, function(err){
					res.redirect('/profile');
					return;
				});
			}else{
				Job.update({_id: req.params.jobId}, 
					{
						Author: req.session.name,
						IconLink: req.body.IconLink,
						Employer: req.body.Employer,
						Title: req.body.Title,
						Timestamp: req.body.Timestamp,
						Type: req.body.Type,
						Location: req.body.Location,
						Pay: req.body.Pay,
						Tag: req.body.Tag,
						RejectedDisabilities: req.body.RejectedDisabilities.split(",").filter(n => n),
						Content: req.body.Content
					},
					{upsert: true}, function(err){
						res.redirect('/profile');
						return;
					});

			}

		}
	});
};



exports.post_a_job_view = function(req, res){
	res.locals.name = req.session.name;
	res.locals.username = req.session.username;
	res.locals.password = req.session.password;
	res.render('post_a_job');
};

exports.post_a_job = function(req, res){
	res.locals.name = req.session.name;
	res.locals.username = req.session.username;
	res.locals.password = req.session.password;

	new Job({
		Author: req.session.name,
		IconLink: req.body.IconLink,
		Employer: req.body.Employer,
		Title: req.body.Title,
		Timestamp: req.body.Timestamp,
		Type: req.body.Type,
		Location: req.body.Location,
		Pay: req.body.Pay,
		Tag: req.body.Tag,
		Content: req.body.Content
	}).save(function(){
		res.redirect('/profile');
	});
};
  