var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var UserSchema = mongoose.Schema({
	email: String,
	username: String,
	password: String,
	
});



var User = module.exports = mongoose.model('User', UserSchema);


module.exports.createUser = function(newUser,req, res, callback){
	console.log("current email:"+newUser.email);
	var query = {email: newUser.email};
	User.find(query,function(err, result){
		console.log(result);
		if(result.length == 0){
			console.log("account valid");
			var bcrypt = require('bcryptjs');
			bcrypt.genSalt(10, function(err, salt) {
			    bcrypt.hash(newUser.password, salt, function(err, hash) {
			        // Store hash in your password DB. 
			        newUser.password = hash;
			        newUser.save(function(err, user){
				      if(err) throw err;
				      console.log("created user:"+user);
				    });
			        response = { status : 200, msg : "success"};
			        console.log("response:"+response+" type:"+ typeof response);
     				callback(res, response);
			    });
			});
		}
		else{
			console.log("account invalid!");
			response = { status : 400, msg : "Account already exists!"};
			console.log("response:"+response+" type:"+ typeof response);
     		callback(res, response);
      	}
      	
	});
	
	
};


module.exports.getUserByName = function(username, callback){
	var query = {username: username};
	console.log("query username:"+query.username);
	User.findOne(query, callback);
};


module.exports.getUserByEmail = function(username, callback){
	var query = {email: email};
	console.log("query email:"+query.email);
	User.findOne(query, callback);
};


module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
};


module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
	//return passwordHash.verify(candidatePassword, this.password);
};

