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
                    query.push(this.id);
                }
            });
            query = '?' + query.join('&');
            $('#page-links a').each(function(){
                $(this).attr('href',$(this).attr('data-init-href') + (query.length > 1 ? query : ''));
            });
            $('#env input:eq(0)').trigger('change');
        });

        $(document).on('change','#env input',function(){
            var env;
            $('#env input').each(function(){
                if ($(this).is(':checked')) {
                    env = this.id;
                }
            });
            $('#page-links a').each(function(){
                $(this).attr('href',$(this).attr('href').replace(/\/\/[^\.]*\./, '//' + env + '.'));
            });
        });
    </script>
</head>
<body>
    <div id="env">
        <label for="de-qa">de-qa</label><input checked id="de-qa" name="env" type="radio"><br/>
        <label for="de-demo">de-demo</label><input id="de-demo" name="env" type="radio"><br/>
        <label for="www">www</label><input id="www" name="env" type="radio"><br/>
    </div>
    <br/>
    <div id="query">
        <label for="dev">dev</label><input checked id="dev" type="checkbox"><br/>
        <label for="min">min</label><input id="min" type="checkbox"><br/>
        <label for="help">help</label><input id="help" type="checkbox"><br/>
    </div>
    <br/>
    <div id="page-links">
    <?php
        $path = "http://www.fairgarage.de/myTESTS/";
        $files = scandir(getcwd());
        foreach ($files as $fileName) {
            if ($fileName !== basename(__FILE__) && !is_dir($fileName)) {
                $html = '<a data-init-href="'.$path.$fileName.'" href="'.$path.$fileName.'">'.$fileName.'</a><br/>';
                echo $html;
            }
        }
    ?>
    </div>
</body>
</html>