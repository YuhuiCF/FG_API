<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getWebkitConfig",
    "description" => "get webkit config",
    "basePath" => "/smp/api/webkit/webkitconfigs",
    "fullPath" => "/smp/api/webkit/webkitconfigs/{key}",
    "functionParams" => array(
        array(
            "parameterName" => "webkitConfigKey",
            "ajaxCheck" => "apiUrl",
            "type" => "string",
            "description" => "webkit config key",
            "isMandatory" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'webkit/webkitconfigs/' + webkitConfigKey"
    )
));

?>
