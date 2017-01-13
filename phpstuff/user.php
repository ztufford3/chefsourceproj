<?php

		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
		
		$keys=$_GET['keys'];
		$userid=$_GET['userid'];
		
	    $con = mysqli_connect('localhost','root','georgiatech','chefsource');
	    if(!$con) {
	      die('Couldnt connect: ' . mysqli_error($con));
	    }

	    $fields = implode(', ', $keys);
	    
	    $result = mysqli_query($con, "SELECT $fields FROM Users WHERE userid='$userid'");
	    $arr = mysqli_fetch_row($result);
	    mysqli_close($con);
	    $output=array_combine($keys, $arr);
	    echo json_encode($output);
	    
		?>