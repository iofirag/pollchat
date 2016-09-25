/************* Moduls **************/
var express = require('express')
, bodyParser = require('body-parser')
, MsgListM = require('./dao').MsgListM


var app = express();
// app.use( bodyParser.urlencoded({extended: true}));
app.use( bodyParser.json() );// to support JSON-encoded bodies
app.use( express.static(__dirname + '/public'));// Serve files from ./www directory

// Static data
var lastUserNumber = 0;

/******************** API ********************/
// Serve web application
app.get('/', function(req, res, next) {
    res.sendFile('index.html', { root: __dirname+'/public'});
});

app.post('/api/newMessage', (req,res)=>{ 
	if (!req.body.msg) return res.status(401).json({description: 'Missing data'})
	
	var msgObj = req.body.msg;
	MsgListM.findOneAndUpdate(
	    {},
	    {$push: {'messages': msgObj}},
	    {safe: true, upsert: true, new: true},
	    function(err, model) {
	    	if (!!err) {  
	        	console.log(err);
	    		return res.status(401).json({description: err})
	    	}
	        res.json({success: 1});
	    }
	);
})

app.get('/api/getMessages', (req,res)=>{
	// console.log(req.query)
	if (!req.query || !req.query.fetchMsgsFrom || !req.query.nickname) return res.status(401).json({description: 'missing params'})
	
	console.log(req.query.fetchMsgsFrom)
	console.log(req.query.nickname)
	MsgListM.aggregate(

	  { $unwind : '$messages' },
	  { $match : {
	     'messages.created_at': { $gte: new Date(req.query.fetchMsgsFrom) },
	     'messages.name' : { $ne: req.query.nickname}
	  }},
	  function(err, models) {
	    	if (!!err) {  
	        	console.log(err);
	    		return res.status(401).json({description: err})
	    	}
	    	if (!!models) res.json(models);
	    	else res.json({description: 'no new messages'})
	    }
	)
})
app.get('/api/cleanAllMessages', (req,res)=>{
	MsgListM.update({}, { $set: { messages: [] }}, function(err, affected){
    	console.log('affected: ', affected);
    	res.json({success:1})
	});
})
app.get('/api/generateNewUser', (req,res)=>{
	res.json({newUser:lastUserNumber++}) 
})


//-------------------------------------
//// Configure server host+port
app.set('host', process.env.HOST || 'localhost');
app.set('port', process.env.PORT || 3333);

app.listen(app.get('port'), function(){
  console.log('Express server listening on ' + app.get('host') + ':' + app.get('port'));
});