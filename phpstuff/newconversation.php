<?php

	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

	$useridSh=$_GET['userid'];
	$arr=json_decode(file_get_contents('php://input'), true);
	$useridRec=$arr['userid'];
	$hash=$arr['hash'];

	$con = mysqli_connect('localhost','root','georgiatech','chefsource');
	if(!$con) {
		print_r('COULDNT CONNECT');
	    die('Couldnt connect: ' . mysqli_error($con));
	}

	$resultSh=mysqli_query($con, "SELECT firstname, lastname FROM Users WHERE userid='$useridSh'");
	$nameSh = mysqli_fetch_all($resultSh,MYSQLI_ASSOC);
	$nameSh = $nameSh[0];
	$resultRec=mysqli_query($con, "SELECT firstname, lastname FROM Users WHERE userid='$useridRec'");
	$nameRec = mysqli_fetch_all($resultRec,MYSQLI_ASSOC);
	$nameRec=$nameRec[0];
	$firstnameSh = $nameSh['firstname'];
	$lastnameSh = $nameSh['lastname'];
	$firstnameRec = $nameRec['firstname'];
	$lastnameRec = $nameRec['lastname'];
	
	date_default_timezone_set('America/New_York');
	$date = new DateTime('now');
	$date=$date->format('Y-m-d H:i:s');
	
	$insert=mysqli_query($con, "INSERT INTO Conversations (useridRec, useridSh, datecreated, open, firstnameRec, lastnameRec, firstnameSh, lastnameSh, hash) VALUES ('$useridRec', '$useridSh', '$date', 1, '$firstnameRec', '$lastnameRec', '$firstnameSh', '$lastnameSh', '$hash')");
		
	echo 1;

	mysqli_close($con);

?>