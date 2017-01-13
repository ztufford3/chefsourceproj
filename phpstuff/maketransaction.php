<?php

	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

	$userid=$_GET['userid'];
	$hash=json_decode(file_get_contents('php://input'), true);
	$hash=$hash['hash'];

	$con = mysqli_connect('localhost','root','georgiatech','chefsource');
	if(!$con) {
		print_r('COULDNT CONNECT');
	    die('Couldnt connect: ' . mysqli_error($con));
	}

	$result=mysqli_query($con, "SELECT * FROM Requests WHERE hash='$hash'");
	$arr = mysqli_fetch_all($result,MYSQLI_ASSOC);
	$arr = $arr[0];
	if(!$arr['open']) {
		echo 0;
		print_r($arr);
	} else {
		mysqli_query($con, "UPDATE Requests SET open=false WHERE hash='$hash'");
		//for the sake of readability
		$otherUserid = $arr['userid'];
		$item = $arr['itemrequested'];
		$item2 = $arr['itemrequested2'];
		$item3 = $arr['itemrequested3'];
		$item4 = $arr['itemrequested4'];
		$note = $arr['note'];
		date_default_timezone_set('America/New_York');
		$date = (new DateTime('now'))->format('Y-m-d H:i:s');
		mysqli_query($con, "INSERT INTO Transactions (useridRec,useridSh,itemrequested,itemrequested2,itemrequested3,itemrequested4,dateof,hash,note,open) 
			VALUES ('$userid','$otherUserid','$item','$item2','$item3','$item4','$date','$hash','$note',1)");
		echo 1;
	}

	mysqli_close($con);

?>