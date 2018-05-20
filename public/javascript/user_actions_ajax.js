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
					html += "<div class='car-display' id='+car.carname+''><b>"+car.carname+"</b><br>Model: "+car.model+"<br>Fare per hour:\
					"+car.fare+"<br>Available units:"+car.available+"\
					<button class='car-display-button' type='button' onclick='javascript:bookCar("+car.carname+");'>Book</button></div>";
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

var bookCar = function(carname){
	console.log("In  boookcar ajax");
	$.ajax({
		url: 'bookcar',
		headers: {"Content-Type" : "application/json"},
		type: "GET",
		data: carname,
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