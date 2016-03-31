<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findLocation",
    "description" => "find location",
    "basePath" => "/smp/api/locations",
    "fullPath" => "/smp/api/locations",
    "functionParams" => array(
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => array("urlParam"),// or "data" if only one value
            "type" => "object",
            "description" => "search criteria; apitesterHint",
        ),
        array(
            "parameterName" => "context",
            "description" => "context",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "limit",
            "description" => "limitHint",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "offset",
            "description" => "offsetHint",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "radius",
            "description" => "search radius",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "regionSignature",
            "description" => "signature of the region",
            "type" => "string",
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'locations'",
        "urlParam" => "extend({context:".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionGetProperty."('contextKey')},criteria)"
        // ajaxcomplete();, ajaxsuccess();, ajaxerror();
    )
));

?>