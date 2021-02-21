"use strict";

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();

module.exports.connect = async function(){
	const url = await mongod.getConnectionString();

	const mongooseOption = {
		"useNewUrlParser" : true,
		"autoReconnect" : true,
		"reconnectTries" : Number.MAX_VALUE,
		"reconnectIntervals" : 1000
	};

	await mongoose.connect(url,mongooseOption);
};

module.exports.closeDatabase = async function(){
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongod.stop();
};

module.exports.clearDatabase = async function(){
	const collections = mongoose.connection.collections;

	for(const key in collections){
		const collection = collections[key];
		await collection.deleteMany();
	}
};