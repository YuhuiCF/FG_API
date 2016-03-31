<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getOfferListFilters",
    "description" => "get offer list filters",
    "basePath" => "/smp/api/offers",
    "fullPath" => "/smp/api/offers/{offerSearchKey}/filters",
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
            "parameterName" => "filterConfig",
            "description" => "filter configuration",
            "type" => "number or string",
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'offers/' + offerSearchKey + '/filters'",
        "urlParam" => "criteria"
    )
));

?>