<?php

		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
		//ini_set('display_errors', 1);
		$userid=$_GET['userid'];
		
	    $con = mysqli_connect('localhost','root','georgiatech','chefsource');
	    if(!$con) {
	      die('Couldnt connect: ' . mysqli_error($con));
	    }
	    
	    $result;
	    if($userid)
	    	$result = mysqli_query($con, "SELECT * FROM Transactions WHERE useridRec='$userid' or useridSh='$userid'");
	    else
	    	$result = mysqli_query($con, "SELECT * FROM Transactions");
	    $arr;
	    if($result) {
	    	$arr = mysqli_fetch_all($result, MYSQLI_ASSOC);
	    } else {
	    	$arr = false;
	    }

	    $itemsarr = [];
	    $count  = 0;

	    date_default_timezone_set('America/New_York');
	    $now = new DateTime('now');

	    foreach($arr as $transaction) {
	    	/*$duration = $request['duration'];

	    	$date = date_create_from_format('Y-m-d H:i:s',$request['datecreated']);
	    	
	    	$date=date_add($date, date_interval_create_from_date_string($duration));
	    	$timediff = $date->getTimestamp()-$now->getTimestamp();
	    	$daydiff = floatval((date_diff($now,$date)->format('%r%a')));
	    	$arr[$count]['time'] = $daydiff;
	    	$arr[$count]['time'] .= ' d ';
	    	$arr[$count]['time'] .= date('H \h i \m',$timediff);
	    	if(($daydiff < 0) || ($daydiff == 0 && $timediff <= 0)) {
	    		$hash = $request['hash'];
	    		$id = $request['userid'];
	    		mysqli_query($con, "UPDATE Requests SET open=false WHERE hash='$hash' and userid=$userid");
	    		$arr[$count]['open'] = '0';
	    		$arr[$count]['time'] = '0 d 0 h';
	    	}*/
	    	array_push($itemsarr, $transaction['itemrequested'],$transaction['itemrequested2'],$transaction['itemrequested3'],$transaction['itemrequested4']);
	    	$temparr=array_filter($itemsarr);
	    	unset($arr[$count]['itemrequested'],$arr[$count]['itemrequested2'],$arr[$count]['itemrequested3'],$arr[$count]['itemrequested4']);
	    	$arr[$count]['items'] = $temparr;
	    	$count++;
	    	$itemsarr = [];
	    }

	    mysqli_close($con);
	    echo json_encode($arr);
	    
		?>