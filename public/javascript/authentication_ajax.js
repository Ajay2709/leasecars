var adminPassword = "iamadmin";
var signup = function(){
	console.log("in signup ajax");
	data = {"email" : document.getElementById("inputEmail").value, 
			"password" : document.getElementById("inputPassword").value,
			"confirmPassword" : document.getElementById("inputConfirmPassword").value,
			"username" : document.getElementById("inputName").value };
	console.log(data);
	$.ajax({
		url: 'signup',
		headers: {"Content-Type" : "application/json"},
		type: "POST",
		data: JSON.stringify(data),
		success : function(result){
			console.log("return to signup ajax success:"+result);
			var data = JSON.parse(result);
			if(data.status == 200){
				window.location = "/login";	
			}
			else{
				document.getElementById('error_msg').innerHTML = "<div class='alert alert-danger'>"+data.msg+"<br></div>";
			}
			
		},
		error : function(result){
			console.log("return to signup ajax failure");
			window.location = "/signup";
		}
 	});
}


var login = function(){
	console.log("in login ajax");
	data = {
			username: document.getElementById("inputName").value,
			//email: document.getElementById("inputEmail").value, 
			password: document.getElementById("inputPassword").value};
	console.log(data);
	$.ajax({
		url: 'login',
		headers: {"Content-Type" : "application/json"},
		type: "POST",
		data: JSON.stringify(data),
		success : function(result){
			console.log("return to login ajax success");
			var data = JSON.parse(result);
			if(data.status == 200){
				window.location = "/homepage";
				console.log("current user: "+data.user);	
			}
			else{
				console.log("login faled in ajax");
				document.getElementById('error_msg').innerHTML = "<div class='alert alert-danger'>"+data.msg+"<br></div>";
			}
		},
		error : function(result){
			console.log("return to login ajax failure");
			window.location = "/login";
		}
 	});
}


var adminEnterPassword = function(){
	document.getElementById('adminpwd').innerHTML = '<form id="signup_form" class="form-signin text-center" style="margin:auto">\
	<input type="password" id="adminPassword" class="form-control" name="password" placeholder="Password" required>\
  	<button class="btn btn-lg btn-primary btn-block" type="button" onclick="javascript:adminLogin();">Enter Password</button>';
}


var adminLogin = function(){
	console.log("in admin login ajax");
	if(document.getElementById('adminPassword').value === adminPassword){
		window.location = "/adminHome";
	}
	else{
		document.getElementById('error_msg').innerHTML = "<div class='alert alert-danger'>Admin Password Incorrect!<br></div>";
	}
}


var adminChangePassword = function(){
	console.log("adminPassword:"+adminPassword);
	document.getElementById('adminpwd').style.display = "block"; 
}


var adminUpdatePassword = function(){
	console.log("in admin login ajax");
	if(document.getElementById('adminOldPassword').value === adminPassword){
		adminPassword = document.getElementById('adminNewPassword').value;
		document.getElementById('error_msg').innerHTML = "<div class='alert alert-success'>Admin Password Changed!<br></div>";
		document.getElementById('adminpwd').style.display = "none"; 
	}
	else{
		document.getElementById('error_msg').innerHTML = "<div class='alert alert-danger'>Admin Password Incorrect!<br></div>";
	}
}

