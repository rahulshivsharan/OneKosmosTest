var app = require("./app");
var http = require("http");
var SERVER_PORT = 8087;
var dbHandler = require("./db-handler");
var dbSetup = require("./service/initialDBSetup");

var startGracefulShutdown = startGracefulShutdown;

var server = app.listen(SERVER_PORT,function(){
	var host = server.address().address;
  	var port = server.address().port;  	  	
  	dbHandler.connect();
  	dbSetup.createUsers();	
  	console.log("Example app listening at http://%s:%s", host, port);
});

process.on('SIGTERM', startGracefulShutdown);
process.on('SIGINT', startGracefulShutdown);

function startGracefulShutdown(){
	console.log("Starting shutdown of express");
	dbHandler.clearDatabase();
  	dbHandler.closeDatabase();	
	server.close(function () {
    	console.log('Express shut down.');
  	});	
};