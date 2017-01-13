<?php

		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

		$hash = json_decode(file_get_contents('php://input'), true);
		
	    $con = mysqli_connect('localhost','root','georgiatech','chefsource');
	    if(!$con) {
	    	print_r('COULDNT CONNECT');
	      die('Couldnt connect: ' . mysqli_error($con));
	    }

	    $hash = $hash['hash'];

	    $check=false;
	    $deleted=mysqli_query($con, "UPDATE Transactions SET deleted=true WHERE hash='$hash' and open=true");
	    $deleted=mysqli_query($con, "UPDATE Transactions SET open=false WHERE hash='$hash' and open=true");
	    if($deleted) {
	    	$check=mysqli_query($con, "UPDATE Requests SET open=true WHERE hash='$hash'");
	    }

	    mysqli_close($con);

	    echo json_encode($check);
	    
		?>