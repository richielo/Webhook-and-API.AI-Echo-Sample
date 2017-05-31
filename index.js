'use strict';

//lets require/import the mongodb native drivers.
var mongoose = require('mongoose');
var async = require('async');

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
    
    var action = req.body.result.action; 
    var subject = req.body.result.parameters.subject;
    var content = req.body.result.parameters.text;
    console.log("subject: " + subject);
    console.log("content: " + content);
    
    var msg = "Dafaq are you saying!";
    process.nextTick(function() {
        if(action == 'get'){
            note.findOne({'subject': subject}, 'subject content', function(err, note){
                if(err){
                        console.log(err);
                }
                if(!note){
                    msg = "Fuck, I can't find anything about " + subject;
                }
                else{
                    msg = note.content;
                }
                
                console.log("msg: " + msg);
                return res.json({
                    speech: msg,
                    displayText: msg,
                    source: 'webhook-echo-sample'
                });
            });
        }
        else if(action == 'input'){
        
            var old_content = "";
            async.series([
                function(callback){
                    note.findOne({'subject': subject}, 'subject content', function(err, note){
                        if(note){
                            old_content = note.content;
                        }
                    });        
                    console.log('oldcontent: ' + old_content);
                },
                function(callback){
                     note.findOneAndUpdate({'subject':subject}, {$set:{'content': old_content + '\n' + content}}, { upsert: true, new: true, setDefaultsOnInsert: true }, function(err, note){
                    if(err){
                        msg = "Something fucking wrong happened";
                    } 
                    else{
                        msg = "Your note has been saved successfully";
                    }
                    });
                }
            ], function(err){
            });
            console.log(msg);
            return res.json({
                speech: msg,
                displayText: msg,
                source: 'webhook-echo-sample'
            });
        }
        else if(action == 'search'){
            //bla
            console.log('search');
            subject = req.body.result.parameters.any;
            note.find({$or:[{'subject': new RegExp(subject, 'i')}, {'content': new RegExp(subject, 'i')}]}, 'subject content', function(err, notes){ 
                if(notes.length > 0){
                    var i;
                    msg = "Your majesty, I found " + subject + " in ";
                    console.log(notes.length);
                    for(i = 0; i < notes.length; i++){
                        if(notes.length == 1){
                            msg += notes[i].subject;
                        }
                        else if(i == notes.length - 2){
                            msg += notes[i].subject + " and ";
                        }
                        else{
                            msg += notes[i].subject + ' ';
                        }
                    }
                }
                else{
                    msg = "I can't find anything about " + subject;
                }
                return res.json({
                    speech: msg,
                    displayText: msg,
                    source: 'webhook-echo-sample'
                });
            });
        }
        else if(action == 'delete'){
            subject = req.body.result.parameters.subject
            note.remove({'subject' : subject}, function(err){
               if(err){
                   msg = "Something fucking wrong happend.";
               } 
               else{
                   msg = "This note is gone.";
               }
               return res.json({
                    speech: msg,
                    displayText: msg,
                    source: 'webhook-echo-sample'
               });
            });
        }
        else if(action == 'delete.all'){
            note.remove({}, function(err){
               if(err){
                   msg = "Something fucking wrong happend.";
               } 
               else{
                   msg = "You have nothing left";
               }
               return res.json({
                    speech: msg,
                    displayText: msg,
                    source: 'webhook-echo-sample'
               });
            });
        }
    });

});

restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
