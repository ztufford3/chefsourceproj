<?php

	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

	$userid=$_GET['userid'];

	$con = mysqli_connect('localhost','root','georgiatech','chefsource');
	if(!$con) {
		print_r('COULDNT CONNECT');
	    die('Couldnt connect: ' . mysqli_error($con));
	}

	$result=mysqli_query($con, "SELECT * FROM Conversations WHERE useridRec='$userid' or useridSh='$userid'");
	$conversations = mysqli_fetch_all($result,MYSQLI_ASSOC);
	
	echo json_encode($conversations);

	mysqli_close($con);

?>