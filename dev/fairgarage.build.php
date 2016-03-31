<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>build FG</title>
</head>
<body>

<h1>Build FG API Library</h1>

<div>
    <a class="indexLink" href="index.php">back to index</a><br/>
    <a class="unmandatoryfyLink" href="fairgarage.unmandatoryfy.php">unmandatoryfy</a><br/>
    <a class="helpLink" href="fairgarage.help.php">show help</a><br/>
    <a class="minifyLink" href="fairgarage.minify.php">minify</a>
</div>
<br/>
<div>
<?php

require_once __DIR__.'/_lib/FgApiLibrary.php';
require_once __DIR__.'/_lib/process_php.php';

$query = $_SERVER['QUERY_STRING'];
$queryInclude = 'include&';
$queryExclude = 'exclude&';
$include = substr($query, 0, strlen($queryInclude)) == $queryInclude;
$exclude = substr($query, 0, strlen($queryExclude)) == $queryExclude;
if ($query && ($include || $exclude)) {
    $FgApiLibrary = new FgApiLibrary();

    $fileQuery = 'fairgarage.functions.';
    $files = scandir(getcwd());
    $query = str_replace($queryInclude, '', $query);
    $includeFiles = str_replace('&', '|', $query);
    $includeFilesArray = explode('&', $query);
    //$temp = '';
    $temp = array();
    foreach ($files as $fileName) {
        if (substr($fileName, 0, strlen($fileQuery)) === $fileQuery && preg_match('/\.('.$includeFiles.').php$/', $fileName)) {
            require_once __DIR__.'/'.$fileName;
            preg_match('/\b('.$includeFiles.')\b/', $fileName, $matches);
            //$temp.= $matches[0]."<br/>";
            //array_push($temp, $matches[0]."<br/>");
            array_push($temp, substr($fileName, strlen($fileQuery))."<br/>");
            $index = array_search($matches[0], $includeFilesArray);
            array_splice($includeFilesArray, $index, 1);
        }
    }

    if (sizeof($includeFilesArray) != 0) {
        echo "Function not found:".implode(", ", $includeFilesArray).".<br/><br/>";
    } else {
        echo "All functions (".sizeof($temp).") built in:<br/><br/>";
        //echo $temp;
        asort($temp);
        echo implode('', $temp);

        $targetFile = '_js/fairgarage.js';

        $jsFile = fopen($targetFile, 'w') or die('Unable to open file!');
        $txt = '';
        $txt .= $FgApiLibrary -> libraryStartString;
        $txt .= $FgApiLibrary -> outputFunctions;
        $txt .= $FgApiLibrary -> libraryEndString;
        fwrite($jsFile, $txt);
        fclose($jsFile);

        date_default_timezone_set('Europe/Berlin');
        $backupDirectory = '_js/temp';
        $backupFileName = 'fairgarage.'.date('Y.m.d.H.i.s').'.js';
        //if (mkdir($backupDirectory)) {
            copy($targetFile, $backupDirectory.'/'.$backupFileName);
            echo "<p>
        Library successfully created.<br/>
        Backup file: ".$backupFileName."
    </p>";
        //}

    }
}

?>
</div>

<div>
    <a class="indexLink" href="index.php">back to index</a><br/>
    <a class="helpLink" href="fairgarage.help.php">show help</a><br/>
    <a class="minifyLink" href="fairgarage.minify.php">minify</a>
</div>

<?php

require_once __DIR__.'/_modules/changeHref.html';

?>

</body>
</html>