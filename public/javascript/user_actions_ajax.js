var currentCar = "";
var fetchCars = function(){
	console.log("In  fetchcars ajax");
	$.ajax({
		url: 'fetchcars',
		headers: {"Content-Type" : "application/json"},
		type: "GET",
		success : function(result){
			console.log("return to signup ajax success:"+result);
			var data = JSON.parse(result);
			var cars = data.data;
			if(data.status == 200){
				//window.location = "/adminHome";
				var html = "";
				for(car of cars){
					html += "<div class='car-display' id='+car.carname+''><b>"+car.carname+"</b><br>Model:\
					 "+car.model+"<br>Fare per hour:\
					"+car.fare+"<br>Available units:"+car.available+"\
					<br><img src=/images/"+car.carname.replace(/ /g,'')+".jpeg class='image' alt='CAR'>\
					<br><a href='#bookpopup' data-rel='popup'>Book</a></div>";
				}
				document.getElementById("carlist").innerHTML = html;
			}	
			else{
				document.getElementById('error_msg').innerHTML = "<div class='alert alert-danger'>"+data.msg+"<br></div>";
			}
			
		},
		error : function(result){
			console.log("return to signup ajax failure");
			document.getElementById('error_msg').innerHTML = JSON.stringify(result);
		}
 	});
}


var showBookingForm = function(carname){
	console.log("in show booking form");
	currentCar = carname;
	document.getElementById('bookingform').style.display = "block";
}
var bookCar = function(){
	console.log("In  boookcar ajax");
	var data = {
		carname: currentCar,
		user: req.session.passport.user,
		location: document.getElementById('location').value,
		hiredate: document.getElementById('hireDate').value,
		returndate: document.getElementById('returnDate').value,
	}
	$.ajax({
		url: 'bookcar',
		headers: {"Content-Type" : "application/json"},
		type: "POST",
		data: JSON.stringify(data),
		success : function(result){
			console.log("return to signup ajax success:"+result);
			var data = JSON.parse(result);
			var cars = data.data;
			if(data.status == 200){
				//window.location = "/adminHome";
				
			}	
			else{
				document.getElementById('error_msg').innerHTML = "<div class='alert alert-danger'>"+data.msg+"<br></div>";
			}
			
		},
		error : function(result){
			console.log("return to signup ajax failure");
			document.getElementById('error_msg').innerHTML = JSON.stringify(result);
		}
 	});	
}