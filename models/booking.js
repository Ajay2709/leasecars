var mongoose = require('mongoose');
var User = require('./models/user');
var Car = require('./models/car');

var BookingSchema = mongoose.Schema({
	carname: String,
	user: mongoose.Schema.Types.ObjectId,
	location: String,
	hiredate: Date,
	returndate: Date
});


module.exports.bookCar = function(req, res, carname, callback){
	console.log("in book car model"+carname);
	var newBooking = {
		carname : carname,
		user: req.session.passport.user,
		hireDate: 
	}
	console.log("in add car model:");
	var query = {user: newCar.carname};
	User.findById(user, function(err, doc){
		if(err) throw err;
		console.log("Query result:");
		console.log(doc);
		if(doc.length == 0){
			Car.create(newCar, function(err, result){
				if(err) throw err;
				console.log("car booked!");
				var response = { status: 200, msg: "One car booked!"};
				callback(res, response);
			});
		}
		else{
			console.log("You have already booked a Car!");
			var response = { status: 400, msg: "Car already booked!"};
			callback(res, response);
		}
	});
}

