<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findMailConfig",
    "description" => "find mail configuration",
    "basePath" => "/smp/api/mailconfigs",
    "fullPath" => "/smp/api/mailconfigs",
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
            "parameterName" => "isPublic",
            "description" => "whether the mail configuration is public or not",
            "type" => "boolean",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "languageCode",
            "description" => "languageCodeHint",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "name",
            "description" => "name of the mail configuration",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "locationId",
            "description" => "locationIdHint",
            "type" => "number",
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'mailconfigs'",
        "urlParam" => "criteria"
        // ajaxcomplete(), ajaxsuccess(), ajaxerror()
    )
));

?>