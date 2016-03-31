<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "updateContext",
    "description" => "update/put context",
    "basePath" => "/smp/api/contexts",
    "fullPath" => "/smp/api/contexts/{key}",
    "functionParams" => array(
        array(
            "parameterName" => "context",
            "ajaxCheck" => array("data","apiUrl"),
            "type" => "object",
            "description" => "context config; apitesterHint",
            "isMandatory" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'PUT'",
        "apiUrl" => "'contexts/' + context.key",
        "data" => "context",
        "urlParam" => "{locationId:context.locationId}"
    )
));

?>