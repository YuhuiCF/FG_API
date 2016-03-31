<?php

$thisFileName = __FILE__;
$fileQuery = basename(__FILE__, "php");

$files = scandir(getcwd());
foreach ($files as $fileName) {
    if (substr($fileName, 0, strlen($fileQuery)) === $fileQuery && $fileName !== $thisFileName) {
        require_once __DIR__.'/'.$fileName;
    }
}

?>
