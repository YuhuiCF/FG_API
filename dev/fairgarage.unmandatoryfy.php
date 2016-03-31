<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>unmandatoryfy FG</title>
    <style>
    </style>
    <script>
    </script>
</head>
<body>

<h1>"unmandatoryfy" FG API Library</h1>

<?php

$outputString = '';
$handle = fopen("_js/fairgarage.js", "r");
if ($handle) {
    $isToBeRemoved = false;
    $isFunctionToBeRemoved = false;
    $functionEnd = '        };';
    while (($line = fgets($handle)) !== false) {
        if ($isToBeRemoved) {
            if (strpos($line, 'check mandatory fields end')) {// last line of block to be removed
                $isToBeRemoved = false;
            } else {
                if ($isFunctionToBeRemoved && substr($line, 0, strlen($functionEnd)) == $functionEnd) {
                    $isFunctionToBeRemoved = false;
                    $isToBeRemoved = false;
                }
            }
        } else {
        if (strpos($line, 'check mandatory fields start')) {// 1st line of block to be removed
                $isToBeRemoved = true;
            } else {
                if (strpos($line, '/** areMandatoryParmsSet')) {// remove the function in the object
                    $isToBeRemoved = true;
                    $isFunctionToBeRemoved = true;
                } else {// normal lines
                    $outputString .= $line;
                }
            }
        }
    }

    fclose($handle);
} else {
    // error opening the file.
}

$myfile = fopen("_js/fairgarage.unmandatoryfy.js", "w") or die("Unable to open file!");

fwrite($myfile, $outputString);
fclose($myfile);

?>
<div>
    <p>unmandatoryfy completed</p>
    <a href="fairgarage.minify.php?unmandatoryfy">minify unmandatoryfy</a><br/>
    <a href="fairgarage.help.php?unmandatoryfy">help unmandatoryfy</a><br/>
    <a href="index.php">back to index</a>
</div>

</body>
</html>