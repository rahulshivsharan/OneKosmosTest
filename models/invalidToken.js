"use strict";

const mongoose = require("mongoose");

const invalidTokenSchema = new mongoose.Schema({
	"token" : {
		"type" : String,
		"required" : true
	}
});	

module.exports = mongoose.model("invalidToken",invalidTokenSchema);