<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "logout",
    "description" => "logout",
    "basePath" => "/smp/api/authentication/current",
    "fullPath" => "/smp/api/authentication/current",
    "ajaxDefaultParams" => array(
        "type" => "'DELETE'",
        "apiUrl" => "'authentication/current'",
        "complete" => "function(jqXHR,textStatus){
    	            delete ".$FgApiLibrary -> varPrivate.".".$FgApiLibrary -> sessionId.";
    	            ajaxcomplete();
                }"
    )
));

?>
