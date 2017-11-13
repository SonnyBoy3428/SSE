var config = require('config');
var fs = require('fs'); //for modifying html values
var jsonFile = require('jsonfile');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 

app.use('/', express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/config', express.static(__dirname + '/config'));
app.use('/img', express.static(__dirname + '/img'));



////////////////////////////////////////////////////////
//----------------------------------------------------//
////////////////////////////////////////////////////////
app.get('/', (req, res) => {
	res.redirect('/login');
});

app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/public/login.html');
});

//ex.: localhost:8080/redirect?url=http://www.google.com
app.get('/redirect', (req, res) => {
	res.redirect(req.query.url);
});

//this route needs to stay at the bottom of all GETs, so it matches only when all others didn't already
//ex.: localhost:8080/config/default.json
app.get('/:path', (req, res) => {
	res.sendFile(__dirname + req.params.path);
});




////////////////////////////////////////////////////////
//----------------------------------------------------//
////////////////////////////////////////////////////////
var dir = './data';
var file = './data/userdata.json';
var userList;

app.post('/signin', (req, res) => {
	console.log(req.body.email);
	console.log(req.body.password);

	loadUserData(req, res);
});

function loadUserData(req, res) {
	userList = [];
	jsonFile.readFile(file, function(err, obj) {
		userList= obj.Users;
		handlePostRequest(req, res);
	})
}

function handlePostRequest(req, res) {
	var foundUser = false;
	var email = req.body.email;
	var password = req.body.password;

	for (var i = 0; i < userList.length; i++) {
		if (email.toLowerCase() === userList[i].Email && password.toLowerCase() === userList[i].Password){
			foundUser = true;
			break;
		} 
	}

	if(foundUser) {
		res.redirect('/home.html');
	}else{
		res.send('Wrong username or password.');
	}
}



////////////////////////////////////////////////////////
//----------------------------------------------------//
////////////////////////////////////////////////////////
var server = app.listen(config.appServer.port, config.host, () => {
	console.log('Listening to http://' + server.address().address + ':' + server.address().port);
});