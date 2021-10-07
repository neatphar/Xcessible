
require('./models/db')
var express = require('express');

var routes = require('./routes');
var others = require('./routes/others');
var http = require('http');
var path = require('path');

var app = express();


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());


app.configure(function(){
	app.use(express.cookieParser());
	app.use(express.cookieSession({
		key: 'node',
		secret: 'thisnodejsexpressblog'
	}));
	app.use(express.bodyParser());
})
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/login', others.login_view);
app.post('/login', others.login);
app.get('/logout', others.logout);

app.get('/search', others.search_view);
app.post('/search', others.search);

app.get('/view/:jobId/', others.view_a_job);


app.get('/profile', others.profile);
app.get('/update/:jobId/', others.update_a_job_view);
app.post('/update/:jobId/', others.update_a_job);


app.get('/post', others.post_a_job_view);
app.post('/post', others.post_a_job);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
