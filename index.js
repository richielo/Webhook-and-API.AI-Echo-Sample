'use strict';

//lets require/import the mongodb native drivers.
var mongoose = require('mongoose');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var notesSchema = mongoose.Schema({
    subject : String,
    content : String
});

var note = mongoose.model('note', notesSchema);

//(Focus on This Variable)
var url = 'mongodb://heroku_x165sjcl:70j5vju073lhcmr57k31su0i6t@ds153521.mlab.com:53521/heroku_x165sjcl'; 
mongoose.connect(url, function (error) {
    if (error) console.log(error);
    else console.log('mongo connected');
});
//(Focus on This Variable)

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {
    // Use connect method to connect to the Server
    var msg = "Your note has been saved successfully!";
    console.log("Hi");
    var temp_note = new note({subject: req.body.result.parameters.Subjects, content: req.body.result.parameters.text});
    temp_note.save(function (err) {
        if (err) {
            msg = 'Error on save!';
            console.log('Error on save!');
        }
    });
    
    return res.json({
        speech: msg,
        displayText: msg,
        source: 'webhook-echo-sample'
    });
});

restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
