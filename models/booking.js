var mongoose = require('mongoose');
var User = require('./user');
var Car = require('./car');

var BookingSchema = mongoose.Schema({
	carname: String,
	user: { id: mongoose.Schema.Types.ObjectId, username: String},
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
			Booking.create(newBooking);
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
		   	response = {status: 400, msg: "car not booked"};
		    callback(res,response);
		}
	});
}

module.exports.returnCar = function(req, res, callback){
	console.log("in return car model:"+req.user._id);
	var currentUser = {id: req.user._id, username: req.user.username};
	var query = {'user.username': req.user.username};
	console.log("query:"+JSON.stringify(query));
	Booking.findOne(query, function(err, doc){
		if(err) throw err;
		console.log(JSON.stringify("doc:"+doc));
		if(doc != null){
			Car.findOne({carname: doc.carname}, function(err, doc1){
				if(err) throw err;
				console.log("doc1:"+doc1);
				var oldAvailable = doc1.available;
				var date1 = new Date(doc.hiredate);
				var date2 = new Date(doc.returndate);
				var diffDays = Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)); 
				var totalFare = diffDays*100*doc1.fare;
				Car.findOneAndUpdate({carname:doc.carname},{$set:{available:oldAvailable+1}},function(err, doc2){
					Booking.deleteOne(query, function(err){
						if(err) throw err;
						response = {status: 200, msg: "car returned", fare: totalFare};
				    	callback(res,response);
					});
				});
			});
		}	
		else{
			response = {status: 400, msg: "You have not booked any car!"};
			callback(res,response);
		}
	});
	

}