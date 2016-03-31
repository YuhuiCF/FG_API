<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findContext",
    "description" => "find context",
    "basePath" => "/smp/api/contexts",
    "fullPath" => "/smp/api/contexts",
    "functionParams" => array(
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => "urlParam",
            "type" => "object",
            "description" => "search criteria; apitesterHint"
        ),
        array(
            "parameterName" => "limit",
            "type" => "number",
            "description" => "limitHint",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "locationId",
            "type" => "number",
            "description" => "locationIdHint",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "offset",
            "type" => "number",
            "description" => "offsetHint",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "superseded",
            "type" => "boolean",
            "description" => "superseded",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "webkitConfigKey",
            "type" => "string",
            "description" => "webkit config key",
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'contexts'",
        "urlParam" => "criteria"
    )
));

?>
