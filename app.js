var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var morgan = require("morgan");
var dbSetup = require("./service/initialDBSetup");
var jwt = require("jsonwebtoken");
var apiRoutes = express.Router();
var dbHandler = require("./db-handler");
var userModel = require("./models/user");
var invalidTokenModel = require("./models/invalidToken");


// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// set initial config
app.set("superSecret","2F423F4528482B4D6251655468576D5A"); // secret key

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	var port = 8087;
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// login api
apiRoutes.post("/login",function(req,res){
	try{
		//console.log("User name "+req.body.username);
		userModel.find({
			"username" : req.body.username
		},function(err,user){
			
			//console.log("is Username found ? ",user);	
			
			if(err) throw err;


			if(user === undefined || (Array.isArray(user) && user.length === 0)){ // if user not present with the username, user not found
			
				res.json({
					"success" : false,
					"message" : "Authentication Failed. User not found"
				});
			
			}else if(user !== undefined || (Array.isArray(user) && user.length === 1)){

					// if user is present with the username, 
					// check if password matches
					if(user[0]["password"] !== req.body.password){ // wrong password, 
						res.json({
							"success" : false,
							"message" : "Authentication Failed. Wrong Password"
						});	
					}else{

						// if user is found and password is right,
						// create a token
						var payload = {
							"admin" : user["admin"]
						}

						var token = jwt.sign(payload,app.get("superSecret"),{
							"expiresIn" : 86400 // expires in 12 hours
						});

						// provide the token in response, which user has to 
						// send it in part of request header's for subsiquent request's
						res.json({
							"success" : true,
							"message" : "User Authenticated, you are loged in",
							"token" : token
						});		
					}
			}else{
				res.json({
					"success" : false,
					"message" : "Not able Login"
				});	
			}
		});
	}catch(err){		
		res.json({
			"success" : false,
			"message" : err
		});
	}
	
});

// logs out the user by making the token invalid
apiRoutes.post('/logout', function(req, res) {

	// check headers or url parameters or post parameters for token
	var token = req.body.token || req.param("token") || req.headers["x-access-token"];

	// make the token as invalid by storing the token in the invalid-token-list
	invalidTokenModel.create({
		"token" : token
	}, function(err, invalidToken) {
		res.json({
			"success" : true,
			"message" : "User Logged out"
		});
	});
});



// route to middleware to authenticate and check token
// First it checks whether the token in present in the request header or body
// Second it checks whether the token is invalidated or not by checking its presence in the invalid token list
// If token in not mark as invalid, than it check its validity by jwt api.
apiRoutes.use(function(req,res,next){

	// check headers or url parameters or post parameters for token
	var token = req.body.token || req.param("token") || req.headers["x-access-token"];


	if(token !== undefined && token !== null){

		// check whether the token in present in the invalid
		// list of token's
		invalidTokenModel.find({
			"token" : token
		},function(err,invalidToken){
			
			if(invalidToken === undefined || (Array.isArray(invalidToken) && invalidToken.length === 0)){
				
				// if token in not marked as invalid, then check its validity through json-web-token api
				jwt.verify(token,app.get("superSecret"),function(err,decoded){
					if(err){
						return res.json({
							"success" : false,
							"message" : "Failed to authenticate token"
						});
					}else{
						// if everything is good save to request for use of other routes
						req.decoded = decoded;
						next();
					}
				});
			
			}else if(invalidToken !== undefined || (Array.isArray(invalidToken) && invalidToken.length === 1)){ 

				// if token in marked as invalid; user should login again
				return res.json({
					"success" : false,
					"message" : "Token invalid, Please login again"
				});
			}
		});
		
	}else{

		// if there is no token
		// return an error
		return res.status(403).send({
			"success" : false,
			"message" : "No token Provided"
		});
	}
});



// get the list of users
apiRoutes.get('/users', function(req, res) {
	userModel.find({}, function(err, users) {
		res.json(users);
	});
});

// check token validity and expiry
apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use("/api",apiRoutes);

module.exports = app;