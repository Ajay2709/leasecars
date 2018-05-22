var mongoose = require('mongoose');


var CarSchema = mongoose.Schema({
	carname: String,
	model: String,
	fare: Number,
	count: Number,
	available: Number
});

var Car = module.exports = mongoose.model('Car', CarSchema);

module.exports.addCar = function(req, res, newCar, callback){
	console.log("in add car model:");
	console.log(newCar);
	var query = {carname: newCar.carname};
	Car.find(query, function(err, doc){
		if(err) throw err;
		console.log("Query result:");
		console.log(doc);
		if(doc.length == 0){
			Car.create(newCar, function(err, result){
				if(err) throw err;
				console.log("car added!");
				var response = { status: 200, msg: "One car Added!"};
				callback(res, response);
			});
		}
		else{
			console.log("Car already found!");
			var response = { status: 400, msg: "Car already found!"};
			callback(res, response);
		}
	});
}


module.exports.getCars = function(req, res, callback){
	console.log("in getCars model:");
	Car.find({}, function(err, docs){
		if(err) throw err;
		console.log("Query result:");
		console.log(docs);
		if(docs.length == 0){
			var response = { status: 400, msg: "No cars found!"};
			callback(res, response);
		}
		else{
			console.log(docs.length+" cars fetched!");
			var response = { status: 200, msg: "success", data:docs};
			callback(res, response);
		}
	});
}
