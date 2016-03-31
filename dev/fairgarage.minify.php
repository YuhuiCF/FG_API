<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>minify FG</title>
    <style>
    </style>
    <script>
    </script>
</head>
<body>

<h1>Minify FG API Library</h1>
<?php

    require_once __DIR__.'/_lib/minify.php';

    $query = $_SERVER['QUERY_STRING'];
    $fileSuffix = ($query === 'help' || 'unmandatoryfy' ? '.'.$query : '');
    $originalFile = ($query === 'help' || 'unmandatoryfy' ? $query.' ' : '');

    $minifiedCode = JSMin::minify(file_get_contents('_js/fairgarage'.$fileSuffix.'.js'));
    //echo $minifiedCode;

    $targetFile = '_js/fairgarage'.$fileSuffix.'.min.js';
    $jsFile = fopen($targetFile, 'w') or die('Unable to open file!');
    fwrite($jsFile, $minifiedCode);
    fclose($jsFile);

?>
<div>
    <p>Minify <?php echo $originalFile; ?>completed</p>
    <a class="indexLink" href="index.php">back to index</a>
</div>
<?php

require_once __DIR__.'/_modules/changeHref.html';

?>

</body>
</html>