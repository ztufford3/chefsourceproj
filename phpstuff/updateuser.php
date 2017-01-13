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

	    $success = true;
	    foreach ($arr as $field => $data) {
	    	$result=mysqli_query($con, "UPDATE Users SET $field='$data' WHERE userid=$userid");
	    	if(!$result)
	    		$success=false;
	    }

	    mysqli_close($con);

	    echo json_encode($success);
	    
		?>