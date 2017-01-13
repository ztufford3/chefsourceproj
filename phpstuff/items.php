<?php

		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
		
		$userid = $_GET['userid'];
		$userid = json_decode($userid);
		
	    $con = mysqli_connect('localhost','root','georgiatech','chefsource');
	    if(!$con) {
	      die('Couldnt connect: ' . mysqli_error($con));
	    }
	    
	    $result = mysqli_query($con, "SELECT * FROM Pantry WHERE userid='$userid'");
	    $arr;
	    if($result) {
	    	$arr = mysqli_fetch_all($result, MYSQLI_ASSOC);
	    } else {
	    	$arr = false;
	    }
	    
	    mysqli_close($con);
	    
	    echo json_encode($arr);
	    
		?>