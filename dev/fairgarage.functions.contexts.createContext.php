<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "createContext",
    "description" => "create/post context",
    "basePath" => "/smp/api/contexts",
    "fullPath" => "/smp/api/contexts",
    "functionParams" => array(
        array(
            "parameterName" => "context",
            "ajaxCheck" => "data",
            "type" => "object",
            "description" => "context config; apitesterHint",
            "isMandatory" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'contexts'",
        "urlParam" => "{locationId:context.locationId}",
        "data" => "context"
    )
));

?>
