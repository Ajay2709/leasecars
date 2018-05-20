var mongoose = require('mongoose');
var User = require('./user');
var Car = require('./car');

var BookingSchema = mongoose.Schema({
	carname: String,
	user: mongoose.Schema.Types.ObjectId,
	location: String,
	hiredate: Date,
	returndate: Date
});

var Booking = module.exports = mongoose.model('Booking', BookingSchema);


module.exports.bookCar = function(req, res, newBooking, callback){
	console.log("in book car model"+newBooking);
	var query = {user: newBooking.user};
	Booking.find(query, function(err, doc){
		if(err) throw err;
		if(doc.length == 0){
			Booking.create(JSON.stringify(newBooking));
			console.log(newBooking);
			Car.findOne({carname: newBooking.carname}, function(err, doc1){
				if(err) throw err;
				var oldAvailable = doc1.available;
				Car.findOneAndUpdate({carname:newBooking.carname},{$set:{available:oldAvailable-1}}, function(err, doc2){
					console.log("user car booked.");
		   		 	response = {status: 200, msg: "car booked"};
		    		callback(res,response);
				});
			});	
		}
		else{
			console.log("user already booked.");
		   	response = {status: 200, msg: "car not booked"};
		    callback(res,response);
		}
	});
}

module.exports.returnCar = function(req, res, callback){
	console.log("in return car model"+newBooking);
	var query = {user: req.session.passport.user};
	Booking.findOne(query, function(err, doc){
		Car.findOneAndUpdate({carname:doc.carname},{$set:{available:oldAvailable-1}}, function(err, doc2){
			console.log("car DB updated");
   		});
	});
	Booking.deleteOne(query, function(err){
		if(err) throw err;
		response = {status: 200, msg: "car returned"};
    	callback(res,response);
	});

}