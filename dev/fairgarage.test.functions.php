<?php

require_once __DIR__.'/_lib/FgApiLibrary.php';

$query = $_SERVER['QUERY_STRING'];

$FgApiLibrary = new FgApiLibrary();

$fileName = 'fairgarage.functions.'.$query.'.php';

if ($query && file_exists($fileName)) {

    require_once __DIR__.'/'.$fileName;

    echo "<pre>";
    $FgApiLibrary -> printFunctions();
    echo "</pre>";
} else {
	echo "Requested file does not existe or is not indicated.";
}

?>
