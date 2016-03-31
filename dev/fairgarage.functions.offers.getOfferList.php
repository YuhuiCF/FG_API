<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getOfferList",
    "description" => "get offer list",
    "basePath" => "/smp/api/offers",
    "fullPath" => "/smp/api/offers/{offerSearchKey}",
    "functionParams" => array(
        array(
            "parameterName" => "offerSearchKey",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "offer search key"
        ),
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => array("urlParam"),
            "type" => "object",
            "description" => "criteria to show the results; apitesterHint"
        ),
        array(
            "parameterName" => "limit",
            "description" => "limitHint",
            "type" => "number or string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "offset",
            "description" => "offsetHint",
            "type" => "number or string",
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'offers/' + offerSearchKey",
        "urlParam" => "criteria"
    )
));

?>