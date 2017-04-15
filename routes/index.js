//const authHelpers = require('../lib/_helpers');
//const passport = require('../lib/local');
//router.use(flash());

/*function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg});
}*/
var pool = require('../lib/db');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var request = require('request');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(require('cookie-parser')());
var jsonParser = bodyParser.json()
const getTime = require('get-time'); //Get the time module, currently not being used.
//const flash = require('flash');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const session = require('express-session');
var pool = require('../lib/db');

passport.use(new Strategy(
	function(username,password,cb) {
		pool.query("SELECT * FROM users WHERE username = '" + username +"'", function(err,user) {
			//console.log(user);
			if(err){
				console.log(err);
				return cb(err);}
			if(user.rowCount==0){
				console.log("User Doesn't Exist");
				return cb(null,false);}
			if(user.rows[0].password != password || password == "") {
				console.log("User Password is Wrong");
				return cb(null,false);}
			
			return cb(null,user.rows[0]);
		});
}));
passport.serializeUser(function(user,cb){
	console.log("SERIALIZE USER");
	console.log(user.id);
	cb(null,user.id);
});
passport.deserializeUser(function(id,cb) {
	console.log("DESERIALIZE USER");
	pool.query('SELECT * FROM users WHERE id = ' + id , function(err,user) {
		if(err) {return cb(err);}
		cb(null,user.rows[0]);
	});
	
});
router.use(session({
	secret:"bestgoddamngardenintheworld",
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: false
	}
	}));
router.use(passport.initialize());
router.use(passport.session());



router.post('/login',
	passport.authenticate('local',{failureRedirect:'/'}),
	function(req,res){
			//console.log(res.req.user);
			res.redirect('/');
	});
router.get('/', function(req, res, next) {
  console.log("REQ_USER" + req.user);
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
  console.log(res.user);
  if(res.user){
	res.render('index', {title: 'Telepresence Project' });
  }
  else
  {
	console.log("WEOUTHERE");
	res.render('index', {user: req.user, title: 'Telepresence Project' })
  }
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
	console.log(res);
	
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
