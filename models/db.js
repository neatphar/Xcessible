var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Member = new Schema({
	Name: String,
	Username: String,
	Password: String
});

var Job = new Schema({
	Author: String,
	IconLink: String,
	Employer: String,
	Title: String,
	Timestamp: Date,
	Type: String,
	Location: String,
	Pay: String,
	Tag: String,
	Content: String
});
Job.index({'$**': 'text'});


mongoose.model('Member', Member);
mongoose.model('Job', Job);
mongoose.connect('mongodb://mongo-db:27017/db');
