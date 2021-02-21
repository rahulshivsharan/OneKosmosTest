const userDBService = require("./user");


const userList = [
	{ "username" :  "nick", 	"password" : "Nick343",	"admin" : true	},
	{ "username" :  "tom", 		"password" : "tom456",	"admin" : false	},
	{ "username" :  "jack", 	"password" : "jack890", "admin" : false	},
	{ "username" :  "mike", 	"password" : "mike123", "admin" : false	},
	{ "username" :  "kim", 		"password" : "kim098", 	"admin" : false	},
	{ "username" :  "rick", 	"password" : "rick678", "admin" : false	}
];



module.exports.createUsers = function(){
	try{
		userList.forEach(async function(user){		
			await userDBService.create(user);	
		});
	}catch(err){
		console.log("error while user create "+err);
	}
	
};