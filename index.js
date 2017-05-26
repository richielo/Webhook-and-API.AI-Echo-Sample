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
    
    var subject = req.body.result.parameters.Subjects;
    var content = req.body.result.parameters.text;
    console.log("subject: " + subject);
    console.log("content: " + content);
    
    var msg = "Dafaq are you saying!";
    if(subject){
        if(subject == 'get'){
            note.findOne({'subject': content}, 'subject content', function(err, note){
                if(err){
                        console.log(err);
                }
                if(!user){
                    msg = "Fuck, I can't find anything about" + subject;
                }
                else{
                    msg = note.content;
                }
            });
        }
        else{
            var temp_note = new note({subject: subject, content: content});
            temp_note.save(function (err) {
                if (err) {
                    msg = 'Error on save!';
                    console.log('Error on save!');
                }
                else{
                    msg = "Your note has been saved successfully!"
                }
            });
        }
    }
    console.log("msg: " + msg);
    return res.json({
        speech: msg,
        displayText: msg,
        source: 'webhook-echo-sample'
    });
});

restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
