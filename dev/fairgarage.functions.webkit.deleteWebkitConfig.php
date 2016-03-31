<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "deleteWebkitConfig",
    "description" => "delete webkit config",
    "basePath" => "/smp/api/webkit/webkitconfigs",
    "fullPath" => "/smp/api/webkit/webkitconfigs/{key}",
    "functionParams" => array(
        array(
            "parameterName" => "webkitConfigKey",
            "ajaxCheck" => "apiUrl",
            "isMandatory" => true,
            "type" => "string",
            "description" => "webkit config key"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'DELETE'",
        "apiUrl" => "'webkit/webkitconfigs/' + webkitConfigKey",
        "error" => "function(jqXHR,textStatus,errorThrown){
                    ajaxerror();
                }"
    )
));

?>
