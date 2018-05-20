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
<<<<<<< HEAD
					html += "<div class='car-display' id="+car.carname+"><b>"+car.carname+"</b><br>Model: "+car.model+"<br>Fare per hour:\
					"+car.fare+"<br>Available units:"+car.available+"\
					<button class='car-display-button' type='button' onclick='javascript:showBookingForm('"+car.carname+"');'>Book</button></div>";
=======
					html += "<div class='car-display' id='+car.carname+''><b>"+car.carname+"</b><br>Model:\
					 "+car.model+"<br>Fare per hour:\
					"+car.fare+"<br>Available units:"+car.available+"\
					<br><img src=/images/"+car.carname.replace(/ /g,'')+".jpeg class='image' alt='CAR'>\
					<br><button class='car-display-button' type='button' onclick='javascript:bookCar("+car.carname+");'>Book</button></div>";
>>>>>>> 820cc2c3d3b6112bf47dae13241a461eab1fcfb8
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
	$.ajax({
		url: 'bookcar',
		headers: {"Content-Type" : "application/json"},
		type: "GET",
		data: currentCar,
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