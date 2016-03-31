<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "createWebkitConfig",
    "description" => "create webkit config",
    "basePath" => "/smp/api/webkit/webkitconfigs",
    "fullPath" => "/smp/api/webkit/webkitconfigs",
    "functionParams" => array(
        array(
            "parameterName" => "webkitConfig",
            "ajaxCheck" => "data",
            "isMandatory" => true,
            "type" => "object",
            "description" => "webkit config; apitesterHint"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'webkit/webkitconfigs'",
        "data" => "webkitConfig"
    )
));

?>
