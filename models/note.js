var mongoose = require('mongoose');

var notesSchema = mongoose.Schema({
    subject : String,
    content : String
});