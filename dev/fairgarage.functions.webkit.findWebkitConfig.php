<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findWebkitConfig",
    "description" => "find webkit config",
    "basePath" => "/smp/api/webkit/webkitconfigs",
    "fullPath" => "/smp/api/webkit/webkitconfigs",
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
            "parameterName" => "offset",
			"type" => "number",
			"description" => "offsetHint",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "locationId",
			"type" => "number",
			"description" => "locationIdHint",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "superseded",
			"type" => "boolean",
			"description" => "superseded",
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'webkit/webkitconfigs'",
        "urlParam" => "criteria"
    )
));

?>
