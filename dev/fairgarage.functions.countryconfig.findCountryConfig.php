<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => $FgApiLibrary -> functionFindCountryConfig,//findCountryConfig
    "description" => "find country configuration",
    "basePath" => "/smp/api/countryconfig",
    "fullPath" => "/smp/api/countryconfig",
    "functionParams" => array(
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => "urlParam",
            "type" => "object",
            "description" => "search criteria; apitesterHint"
        ),
        array(
            "parameterName" => "countryCode",
            "description" => "countryCodeHint",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "orderBy",
            "description" => "order by",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "ascending",
            "description" => "in ascending order nor not",
            "type" => "boolean",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "offset",
            "description" => "offsetHint",
            "type" => "number",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "limit",
            "description" => "limitHint",
            "type" => "number",
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'countryconfig'",
        "urlParam" => "criteria"
    )
));

?>