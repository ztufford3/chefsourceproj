function newUser(first, last, loc, diet){
	if(first=="" || last=="" || loc=="" || diet=="") {
		return;
	} else {
		if($window.XMLHttpRequest){
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		var arr = [first, last, loc, diet];
		xmlhttp.open(type: "POST",
			url: "newuser.php",
			data: arr,
			cache: false,
			success: function(){});
		xmlhttp.send();
	}
}