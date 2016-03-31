<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getContext",
    "description" => "get context",
    "basePath" => "/smp/api/contexts",
    "fullPath" => "/smp/api/contexts/{key}",
    "functionParams" => array(
        array(
            "parameterName" => "contextKey",
            "ajaxCheck" => "apiUrl",
            "type" => "string",
            "description" => "context key",
            "isMandatory" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'contexts/' + contextKey"
    )
));

?>
