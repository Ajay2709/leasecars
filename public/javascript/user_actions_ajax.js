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
				var html = "<table class='car-table'>", carName = "";
				for(car of cars){
					carName = car.carname;
					html += "<tr  class='car-display' id='"+car.carname+"'>\
						<td class='image-cell'><img src=/images/"+car.carname.replace(/ /g,'')+".jpeg class='image' alt='CAR'></td>\
						<td class='ibfo-cell'><b>"+car.carname+"</b><br>Model:"+car.model+"\<br>Fare per hour:"+car.fare+"<br>Available units:"+car.available+"<br>\
						<br><button data-target='#bookpopup' data-toggle='modal' class='butn' onclick='javascript:setCurrentCar(\""+carName+"\");'>Book</button>\
						</tr>";
				}
				html += "</table>";
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


var setCurrentCar = function(carname){
	console.log("in setCurrentCar ajax");
	currentCar = carname;
	console.log(currentCar);
}


var bookCar = function(){
	console.log("In  boookcar ajax");
	var data = {
		carname: currentCar,
		location: document.getElementById('location').value,
		hiredate: document.getElementById('hireDate').value,
		returndate: document.getElementById('returnDate').value
	}
	var currentDate = new Date();
	var hDate = new Date(JSON.stringify(data.hiredate));
	var rDate = new Date(JSON.stringify(data.returndate));
	//console.log("current date:"+currentDate + "hiredate:"+ hDate +" return date: "+rDate);
	//console.log("current date:"+currentDate + "hiredate:"+ data.hireDate +" return date: "+data.returndate);
	if(hDate >= currentDate && rDate >= hDate){
		$.ajax({
			url: 'bookcar',
			headers: {"Content-Type" : "application/json"},
			type: "POST",
			data: JSON.stringify(data),
			success : function(result){
				console.log("return to signup ajax success:"+result);
				var data = JSON.parse(result);
				if(data.status == 200){
					//window.location = "/adminHome";
					//document.getElementById('bookpopup').style.display = "none";
					window.alert("Car Booked. Enjoy the trip!");
					document.location.reload();
					document.getElementById('error_msg').innerHTML = "<div class='alert alert-success'>"+data.msg+"<br></div>";

				}	
				else{
					//document.getElementById('bookpopup').style.display = "none";
					window.alert("Car Already Booked!");
					document.location.reload();
					document.getElementById('error_msg').innerHTML = "<div class='alert alert-danger'>"+data.msg+"<br></div>";
					
				}
				
			},
			error : function(result){
				console.log("return to signup ajax failure");
				document.getElementById('error_msg').innerHTML = JSON.stringify(result);
			}
	 	});	
	}
	else{
		window.alert("Choose Valid Dates!");
	}
}

var returnCar = function(){
	console.log("In  return car ajax");
	$.ajax({
		url: 'returncar',
		headers: {"Content-Type" : "application/json"},
		type: "GET",
		success : function(result){
			console.log("return to returncar ajax success:"+result);
			var data = JSON.parse(result);
			//document.getElementById('error_msg').innerHTML = "<div class='alert alert-success'>"+data.msg+"<br></div>";
			if(data.status == 200){

				window.alert("Car returned.\nTotal Fare:"+data.fare+"\nThank You!");
				document.location.reload();
			}
			else{
				window.alert("You haven't booked any car!");
			}
		},
		error : function(result){
			console.log("return to signup ajax failure");
			document.getElementById('error_msg').innerHTML = JSON.stringify(result);
		}

 	});	
}
 