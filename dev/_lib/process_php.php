
<?php

function process_php($str){
    $php_start = 0;

    $tag = '<?php';
    $endtag = '?>';

    while(is_long($php_start = strpos($str, $tag, $php_start)))
    {
        $start_pos = $php_start + strlen($tag);
        $end_pos = strpos($str, $endtag, $start_pos); //the 3rd param is to start searching from the starting tag - not to mix the ending tag of the 1st block if we want for the 2nd

        if (!$end_pos) { echo "template: php code has no ending tag!", exit; }
        $php_end = $end_pos + strlen($endtag);

        $php_code = substr($str, $start_pos, $end_pos - $start_pos);
        if( strtolower(substr($php_code, 0, 3)) == 'php' )
            $php_code = substr($php_code, 3);

        // before php code
        $part1 = substr($str, 0, $php_start);

        // here set the php output
        ob_start();
        eval($php_code);
        $output = ob_get_contents();
        ob_end_clean();

        // after php code
        $part2 = substr($str, $php_end, strlen($str));

        $str = $part1 . $output . $part2;
    }
    return $str;
}

?>
