var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	name : String,
	message : String,
	created_at : {type:Date, default:Date.now}
})

/* chat Schema */
var msgListSchema = new Schema({
    version: Number,
    messages: [messageSchema]
}, {collection: 'msgList'});

exports.msgListSchema = msgListSchema;