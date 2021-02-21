"use strict";

var userModel = require("../models/user");

module.exports.create = async function(user){
	if(!user) throw new Error("Missing User");

	await userModel.create(user);
};

module.exports.authenticate = async function(userName,password){
	const user = await userModel.find({
		"username" : userName,
		"password" : password
	}).exec();

	return user;
};