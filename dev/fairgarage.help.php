<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>set help FG</title>
    <style>
    </style>
    <script>
    </script>
</head>
<body>

<h1>"Help" FG API Library</h1>

<?php

$query = $_SERVER['QUERY_STRING'];
$fileSuffix = ($query === 'help' ? '.'.$query : '');
$originalFile = ($query === 'help' ? $query.' ' : '');

$tab = '    ';
$outputString = '';
$handle = fopen("_js/fairgarage.js", "r");
if ($handle) {
    $isFunctionDescription = false;
    $description = array();
    $functionFound = false;
    $returnFunctionObj = '        return';
    $functionObj = '';
    $functionParamMatches = array();
    $removeNbOfFistChars = 8;
    while (($line = fgets($handle)) !== false) {
        if (strpos($line, 'fg = function') !== false) {// search for function description
            preg_match('/\(.+\)/', $line, $functionParamMatches);// get function parameter name
        }
        if (strpos($line, '.properties = {') !== false) {// description about the properties
            preg_match('/(\w)+/', $line, $functionObj);
        }
        if (substr($line, 0, strlen($returnFunctionObj)) == $returnFunctionObj) {// search for FG function constructor
            $pobj = substr($functionParamMatches[0], 1, -1);
            //$outputString .= $tab.$tab.'if ('.$pobj.' == "help") {
//'.$tab.$tab.$tab."console.log('Available functions:');
//".$tab.$tab.$tab."for (var key in ".$functionObj[0].") {
//".$tab.$tab.$tab.$tab."if (typeof ".$functionObj[0]."[key] == 'function'){;
//".$tab.$tab.$tab.$tab.$tab."console.log(key.toString() + '()');
//".$tab.$tab.$tab.$tab."}
//".$tab.$tab.$tab."};
//".$tab.$tab.$tab.'return;'."\n";
            $outputString .= $tab.$tab.'if ('.$pobj.' === "help") {
'.$tab.$tab.$tab."var functions = 'Available functions in FairGarage API library:".'\r\n'."';
".$tab.$tab.$tab."for (var key in ".$functionObj[0].") {
".$tab.$tab.$tab.$tab."if (typeof ".$functionObj[0]."[key] === 'function'){;
".$tab.$tab.$tab.$tab.$tab."functions += (key.toString() + '()".'\r\n'."');
".$tab.$tab.$tab.$tab."}
".$tab.$tab.$tab."};
".$tab.$tab.$tab."return console.log(functions);
";

            //echo $tab.$tab.$tab.'}'."\n";
            $outputString .= $tab.$tab.'}'."\n";
        }
        if (strpos($line, '/**') !== false && strpos($line, '/***') === false) {// search for function description
            $isFunctionDescription = true;
        }
        if ($isFunctionDescription) {// store function description
            array_push($description, $line);
        } else {
            //echo $line;
            $outputString .= $line;
            if ($functionFound && strpos($line, 'function') !== false) {
                preg_match('/\(.+\)/', $line, $matches);// get function parameter name
                $pobj = substr($matches[0], 1, -1);
                //echo $tab.$tab.$tab.'if (', $pobj, ' === "help") {', "\n";
                $outputString .= $tab.$tab.$tab.'if ('.$pobj.' === "help") {'."\n";
                $outputString .= $tab.$tab.$tab.$tab.'console.log("';
                foreach ($description as $value) {
                    //echo $tab.$tab.$tab.$tab.'console.log("', substr_replace(str_replace('"', '\"', $value), '");', -1, 0);
                    //$outputString .= $tab.$tab.$tab.$tab.'console.log("'.substr_replace(str_replace('"', '\"', $value), '");', -1, 0);
                    //$outputString .= str_replace("\n", '\r\n', str_replace('"', '\"', $value));
                    $outputString .= str_replace("\n", '\r\n', str_replace('"', '\"', substr($value, $removeNbOfFistChars)));
                }
                $outputString .= "\");";
                //echo $tab.$tab.$tab.$tab.'return;'."\n";
                $outputString .= $tab.$tab.$tab.$tab.'return;'."\n";
                //echo $tab.$tab.$tab.'}'."\n";
                $outputString .= $tab.$tab.$tab.'}'."\n";
                $functionFound = false;
                $description = array();
            }
        }
        if ($isFunctionDescription && strpos($line, '*/') !== false) {// function description end
            $isFunctionDescription = false;
            $functionFound = true;
        }
    }

    fclose($handle);
} else {
    // error opening the file.
}

$myfile = fopen("_js/fairgarage.help.js", "w") or die("Unable to open file!");

fwrite($myfile, $outputString);
fclose($myfile);

?>
<div>
    <p>Set help completed</p>
    <a href="fairgarage.minify.php?help">minify help</a><br/>
    <a href="index.php">back to index</a>
</div>

</body>
</html>