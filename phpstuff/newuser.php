<?php

		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

		$arr = json_decode(file_get_contents('php://input'), true);
		
		try {
	    	$con = mysqli_connect('localhost','root','georgiatech','chefsource');
	    } catch(Exception $e) {
	    	echo "Service Unavailable";
	    	echo "message: " . $e->message;
	    }
	    if(!$con) {
	      die('Couldnt connect: ' . mysqli_error($con));
	    }

	    $userid=$arr['userid'];
	    $username=$arr['username'];
	    $password=$arr['password'];
	    $email=$arr['email'];
	    $first=$arr['first'];
	    $last=$arr['last'];
	    $street=$arr['street'];
	    $city=$arr['city'];
	    $state=$arr['state'];
	    $zip=$arr['zip'];
	    $apikey=$arr['apikey'];
	    $diet=$arr['diet'];

	    mysqli_query($con, "INSERT INTO Users (userid, username, password, firstname, lastname, email, street, city, zip, state, apikey, diet)
	    	VALUES('$userid','$username','$password','$first','$last','$email','$street','$city','$zip','$state','$apikey','$diet')");

	    mysqli_close($con);

	    echo json_encode($arr);
	    
		?>