<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "deleteContext",
    "description" => "delete context",
    "basePath" => "/smp/api/contexts",
    "fullPath" => "/smp/api/contexts/{key}",
    "functionParams" => array(
        array(
            "parameterName" => "contextKey",
            "ajaxCheck" => "apiUrl",
            "isMandatory" => true,
            "type" => "string",
            "description" => "context key",
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'DELETE'",
        "apiUrl" => "'contexts/' + contextKey",
        "error" => "function(jqXHR,textStatus,errorThrown){
                    ajaxerror();
                }"
    )
));

?>
