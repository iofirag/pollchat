var mongoose = require('mongoose');
//configuring connection to mongoLab
var connection = mongoose.connect('mongodb://admin:1234@ds021346.mlab.com:21346/chat');


// Import schema modules
var msgListSchema = require('./msgListSchema').msgListSchema;
// decleare alias name for the imported schemas
mongoose.model('MsgListM' , msgListSchema);
// Export schemas
exports.MsgListM = mongoose.model('MsgListM');



// Save connection object
var conn = mongoose.connection;
// Mongoose error message output
conn.on('error', console.error.bind(console, 'connection error:'));
// Once a connection is initiated - do the following
conn.once('open' , ()=>{
	console.log('connected');
});




// When the node process is terminated (Ctrl+c is pressed) , close the connection to the DB.
process.on('SIGINT', ()=>{
  mongoose.connection.close( ()=>{
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});