<!DOCTYPE html>
<html>
	<head>
	</head>
	<body>
		<?php
	    $con = mysqli_connect('localhost','root','GaTech1','chefsourcedb');
	    if(!$con) {
	      die('Couldnt connect: ' . mysqli_error($con));
	    }
	    $arr=$_POST['arr'];
	    $arr=json_decode("$arr",true);
	    $first=$arr['$first'];
	    $last=$arr['$last'];
	    $loc=$arr['$loc'];
	    $diet=$arr['$diet'];
	    mysqli_query($con, "INSERT INTO Users(FirstName, LastName, Address, DietaryRestrictions)
	    	VALUES('$first','$last','$loc','$diet')");
	    mysqli_close($con);
		?>
	</body>
</html>