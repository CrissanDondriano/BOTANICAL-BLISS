<?php

	require_once 'config.php';

	$request = sanitize($_REQUEST);

	$validation = validate($request, [
		'email' => 'required|email|min:2|max:100',
		'contact_number' => 'required|min:2|max:100',
		'office_address' => 'required|min:2|max:100',
		'message' => 'required|min:2|max:250'
	]);

	$result = [];

	if(!count($validation)):
		$sql = "INSERT INTO tbl_concern (email, contact_number, office_address, message)
		VALUES (
			'".$request['email']."', 
			'".$request['contact_number']."', 
			'".$request['office_address']."', 
			'".$request['message']."'
		)";

		if ($db->query($sql)) {
		  $result['response'] = "Your message has been sent.";
		} else {
		  $result['response'] = "Error: " . $sql . "<br>" . $db->error;
		}

		$db->close();
	else:
		$result['has_error'] = 1;
	   	$result['errors'] = $validation;
	endif;

	echo json_encode($result);
?>


