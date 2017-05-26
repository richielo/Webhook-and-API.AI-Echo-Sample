'use strict';

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
var mongoose = require('mongoose');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var notesSchema = mongoose.Schema({
    subject : String,
    content : String
});

note = mongoose.model('note', notesSchema);

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
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
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

restService.post('/slack-test', function(req, res) {

    var slack_message = {
        "text": "Details of JIRA board for Browse and Commerce",
        "attachments": [{
            "title": "JIRA Board",
            "title_link": "http://www.google.com",
            "color": "#36a64f",

            "fields": [{
                "title": "Epic Count",
                "value": "50",
                "short": "false"
            }, {
                "title": "Story Count",
                "value": "40",
                "short": "false"
            }],

            "thumb_url": "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
        }, {
            "title": "Story status count",
            "title_link": "http://www.google.com",
            "color": "#f49e42",

            "fields": [{
                "title": "Not started",
                "value": "50",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }]
        }]
    }
    return res.json({
        speech: "speech",
        displayText: "speech",
        source: 'webhook-echo-sample',
        data: {
            "slack": slack_message
        }
    });
});




restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
