var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var jsonFile = require('jsonfile');
var fs = require('fs');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var loggedIn = false;

var stealData = require(path.join(__dirname, '/Routes/stealData.js'));

if(loggedIn === true) {
	// Serve static files (index.html is default file)
	if (process.env['RUNNING_VIA_DOCKER']) {
	    app.use(express.static(path.join(__dirname, '/Public/html/')));
	    app.use('/FakeIndex', express.static(path.join(__dirname, '/FakePublic/html/')));
	} else {
	    app.use(express.static(path.join(__dirname, '../Client/html/')));
	    app.use('/FakeIndex', express.static(path.join(__dirname, '../FakeClient/html/')));
	}
}else {
	if (process.env['RUNNING_VIA_DOCKER']) {
	    app.use(express.static(path.join(__dirname, '/Public/')));
	    app.use('/FakeIndex', express.static(path.join(__dirname, '/FakePublic/')));
	} else {
	    app.use(express.static(path.join(__dirname, '../Client/')));
	    app.use('/FakeIndex', express.static(path.join(__dirname, '../FakeClient/')));
	}
}

app.use('/scripts', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.use('/stealdata', stealData);

app.listen(3000, function(){
	console.log('Listening on port 3000');
});

var dir = './Data';
var file = './Data/userdata.json';

var userList;

function loadUserData(req, res) {
	userList = [];
	jsonFile.readFile(file, function(err, obj) {
		userList= obj.Users;
		handlePostRequest(req, res);
	})
}

function handlePostRequest(req, res) {
	var foundUser = false;
	var userName = req.body.username;
	var userPassword = req.body.password;

	console.log(userList.length);

	for (var i = 0; i < userList.length; i++) {
		if (userName.toLowerCase() === userList[i].Username && userPassword.toLowerCase() === userList[i].Password){
			foundUser = true;
			break;
		} 
	}

	if(foundUser) {
		loggedIn = true;
		// Serve fake static files (fakeindex.html)
		if (process.env['RUNNING_VIA_DOCKER']) {
		    res.sendFile(path.join(__dirname, '/Public/home.html'));
		} else {
		    res.sendFile(path.join(__dirname, '../Client/home.html'));
		}
	}else{
		res.send('Wrong username or password.');
	}
}

app.post('', function(req, res) {
	loadUserData(req, res);
})

app.get('/index.html', function(req, res) {
	console.log('blub');

	loggedIn = false;

	var url = req.params.url;

	res.redirect(url);
})

app.get('/loginpage', function(req, res) {
	console.log(path.join(__dirname, '../Client/'));
	if (process.env['RUNNING_VIA_DOCKER']) {
	    res.sendFile(path.join(__dirname, '/Public/index.html'));
	} else {
	    res.sendFile(path.join(__dirname, '../Client/index.html'));
	}
})