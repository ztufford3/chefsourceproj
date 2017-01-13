<?php

		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

		$hash = json_decode(file_get_contents('php://input'), true);
		
	    $con = mysqli_connect('localhost','root','georgiatech','chefsource');
	    if(!$con) {
	    	print_r('COULDNT CONNECT');
	      die('Couldnt connect: ' . mysqli_error($con));
	    }
	    $hash=$hash['hash'];
	    $check=false;
	    $result=mysqli_query($con, "DELETE FROM Requests WHERE hash='$hash'");
	    $check=mysqli_query($con, "UPDATE Transactions SET deleted=true open=false WHERE hash='$hash' and open='1'");
	    if($deleted)
	    	$check=true;

	    mysqli_close($con);

	    echo json_encode($check);
	    
		?>