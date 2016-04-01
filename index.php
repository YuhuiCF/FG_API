<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>myTESTS pages</title>
    <script src="_js/jquery.min.js"></script>
    <script>
        $(document).ready(function(){
            $('#query input:eq(0)').trigger('change');
            $('#env input:eq(0)').trigger('change');
        });

        $(document).on('change','#query input',function(){
            var query = [];
            $('#query input').each(function(){
                if ($(this).is(':checked')) {
                    query.push($(this).attr('data-query'));
                }
            });
            query = '?' + query.join('&');
            $('#page-links a').each(function(){
                $(this).attr('href',$(this).attr('data-init-href') + (query.length > 1 ? query : ''));
            });
            $('#env input:eq(0)').trigger('change');
        });

        $(document).on('change','#env input',function(){
            var env = $('#env input:checked').attr('data-env');
            $('#page-links a').each(function(){
                $(this).attr('href',$(this).attr('href').replace(/\/\/[^\.]*\./, '//' + env + '.'));
            });
        });
    </script>
</head>
<body>
    <div id="env">
        <label>api-qa<input checked data-env="api-qa" name="env" type="radio"></label><br>
        <label>api<input data-env="api" name="env" type="radio"></label><br>
    </div>
    <br>
    <div id="query">
        <label>dev<input checked data-query="dev" type="checkbox"></label><br>
        <label>min<input data-query="min" type="checkbox"></label><br>
        <label>help<input data-query="help" type="checkbox"></label><br>
    </div>
    <br>
    <div id="page-links">
    <?php
        $path = "http://www.fairgarage.de/myTESTS/";
        $files = scandir(getcwd());
        foreach ($files as $fileName) {
            if ($fileName !== basename(__FILE__) && !is_dir($fileName)) {
                $html = '<a data-init-href="'.$path.$fileName.'" href="'.$path.$fileName.'">'.$fileName.'</a><br>';
                echo $html;
            }
        }
    ?>
    </div>
</body>
</html>