<?php

		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

		$arr = json_decode(file_get_contents('php://input'), true);
		$items = $arr['items'];
		$location = $arr['location'];
		$street = $location[0];
		$city = $location[1];
		$state = $location[2];
		$zip = $location[3];
		$latitude = $location[4];
		$longitude = $location[5];
		$duration = $arr['duration'];
		$note = $arr['note'];
		$username = $arr['username'];

	    $con = mysqli_connect('localhost','root','georgiatech','chefsource');
	    if(!$con) {
	    	print_r('COULDNT CONNECT');
	      die('Couldnt connect: ' . mysqli_error($con));
	    }

	    $userid = $_GET['userid'];

	    date_default_timezone_set('America/New_York');
		$date = new DateTime('now');
		//$date = date_add($date, date_interval_create_from_date_string('22 hours'));
		$date=$date->format('Y-m-d H:i:s');
		
			if($items[0]) {
				$hash = md5(uniqid(rand(), true));
				$result=mysqli_query($con, "INSERT INTO Requests (userid, datecreated, itemrequested, itemrequested2, itemrequested3, itemrequested4, street, city, state, zip, open, duration, note, hash, latitude, longitude, username)
	    		VALUES ('$userid','$date','$items[0]','$items[1]','$items[2]','$items[3]','$street','$city','$state','$zip',1,'$duration','$note','$hash',$latitude,$longitude,'$username')");
				print_r('@@@@@@@');
				print_r($result);
				print_r('@@@@@@@');
			}
	    mysqli_close($con);

	    echo json_encode($arr);
	    
		?>