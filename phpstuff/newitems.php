<?php

		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

		$arr = json_decode(file_get_contents('php://input'), true);
		
	    $con = mysqli_connect('localhost','root','georgiatech','chefsource');
	    if(!$con) {
	    	print_r('COULDNT CONNECT');
	      die('Couldnt connect: ' . mysqli_error($con));
	    }

	    $input = $_GET['userid'];
	    $userid = json_decode($input);
		$date = '3/31/2016';

		foreach ($arr as $ingredient) {
			$food=$ingredient['name'];
			if($food)
				mysqli_query($con, "INSERT INTO Pantry (userid, item, dateadded)
	    		VALUES('$userid','$food','$date')");
		}

	    mysqli_close($con);

	    echo json_encode($arr);
	    
		?>