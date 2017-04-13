var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var request = require('request');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()
const getTime = require('get-time'); //Get the time module, currently not being used.
//const flash = require('flash');
const passport = require('passport');
const session = require('express-session');
router.use(session({
	secret:"bestgoddamngardenintheworld",
	resave: false,
	saveUninitialized: true
	}));

router.use(passport.initialize());
router.use(passport.session());
//router.use(flash());

var pool = require('../lib/db');

router.get('/', function(req, res, next) {
  pool.query('SELECT * FROM garden_status', function(err, db_res) {
  if(err) {
    return console.error('error running query', err);
	res.locals.variable = 'ERROR RUNING QUERY';
	res.render('index', { title: 'Telepresence Project' });
  }
  var send = "";
  
  for(i=0;i<db_res.rows.length;)
  {
	  send = send + '<div class="garden-cell-row">';
	  end= i + 5;
	  j = i;
	  for(;j<=end&&j<=35;j++)
	  {
		  //console.log(db_res.rows[0].id);
		  send = send + '<div class="garden-cell" id = "' + db_res.rows[j].id + '">' +  '</div>';
		  i++;
	  }  
	  send = send + '</div>';
  }
  //send = send + '</div>';
  res.locals.variable = send;
  res.render('index', { title: 'Telepresence Project' });
  //console.log(res.locals.variable);
  });
  
});

router.post('/get-status',jsonParser,function(req,res,next){
  
  if(req.body.id%1==0)
  {
	  pool.query('SELECT * FROM garden_status WHERE id ='+req.body.id, function(err, db_res) {
		res.json({data:db_res,complete:true});
		res.end();
	  });
  }
  else
  {
	res.json({complete:false});
  }
  
});
router.post('/command',jsonParser,function(req,res,next){
	//console.log("Command Send with Post");
	
	if(req.body.command!="water")
	{
		  res.json({complete:false,executed:false});
		  res.end();
	}
	else
	{
		var command = req.body.command;
		var value = req.body.value;
		console.log(command);
		console.log(value);
		data = {
			command: req.body.command,
			value: req.body.value
		}
		request.post({url:'http://rpimusic.hopto.org:3000',body: data,json:true},function(error,response,body){
			if(error)
			{
				return console.log('Error',error);
				res.json({complete:true,executed:false});
				res.end();
			}
			if(response.statusCode!=200){
				res.json({complete:true,executed:false});
				res.end();
				return console.log('Invalid Status Code Returned: ',response.statusCode);
			}
			console.log(response.msg);
			console.log('Response');
			res.json({complete:true,executed:true});
			res.end();
			
		});
	}
});



module.exports = router;
