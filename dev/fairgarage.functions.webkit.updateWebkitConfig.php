<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "updateWebkitConfig",
    "description" => "update/put webkit config",
    "basePath" => "/smp/api/webkit/webkitconfigs",
    "fullPath" => "/smp/api/webkit/webkitconfigs/{key}",
    "functionParams" => array(
        array(
            "parameterName" => "webkitConfig",
            "ajaxCheck" => array("data","apiUrl"),
            "isMandatory" => true,
            "type" => "object",
            "description" => "webkit config; apitesterHint"
        ),
        array(
            "parameterName" => "key",
            "isMandatory" => true,
            "type" => "string",
            "isAjaxDataKey" => true,
            "description" => "webkit config key"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'PUT'",
        "apiUrl" => "'webkit/webkitconfigs/' + webkitConfig.key",
        "data" => "webkitConfig"
    )
));

?>
