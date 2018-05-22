var addNewCar = function(){
	console.log("Add new car function");
	document.getElementById('addcarform').style.display = "block";
	document.getElementById('error_msg').style.display = "none";
}

var addCar = function(){
	console.log("In  addCar ajax");

	/*var data = new FormData();
	jQuery.each(jQuery('#carImage')[0].files, function(i, file) {
    	data.append('file-'+i, file);
    });
    */
    var img=document.getElementById("carImage");
    var data = new FormData();
    data.append('carname',document.getElementById("carName").value);
    data.append('model',document.getElementById("carModel").value);
    data.append('fare',document.getElementById("carFare").value);
    data.append('count',document.getElementById("carCount").value);
    data.append('available',document.getElementById("carCount").value);
   	data.append('img',img.files[0]);
   	console.log(data);
   	$.ajax({
		url: 'addcar',
		headers: {"Content-Type": "multipart/form-data"},//"application/json"
		type: "POST",
		///contentType: false,
    	//processData: false,
    	data: data,//JSON.stringify(data),
		success : function(result){
			console.log("return to signup ajax success:"+result);
			var data = JSON.parse(result);
			if(data.status == 200){
				//window.location = "/adminHome";
				document.getElementById('error_msg').innerHTML = "<div class='alert alert-success'>Car added!<br></div>";	
				document.getElementById('addcarform').style.display = "none";
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
						<td class='image-cell'><img src=images/"+car.carname.replace(/ /g,'')+".jpeg class='image' alt='CAR'></td>\
						<td class='info-cell'><b>"+car.carname+"</b><br>Model:"+car.model+"\<br>Fare per hour:"+car.fare+"<br>Available units:"+car.available+"<br>\
						<br><button data-target='#bookpopup' data-toggle='modal' class='butn'>Remove Car</button>\
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