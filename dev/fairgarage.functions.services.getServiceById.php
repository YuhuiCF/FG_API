<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getServiceById",
    "description" => "get service by service ID",
    "basePath" => "/smp/api/services/services",
    "fullPath" => "/smp/api/services/services/{id}",
    "functionParams" => array(
        array(
            "parameterName" => "serviceId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "serviceIdHint"
        ),
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => array("urlParam"),
            "type" => "object",
            "description" => "search criteria; apitesterHint"
        ),
        array(
            "parameterName" => "constructionTime",
            "type" => "string",
            "description" => "constructionTimeHint",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "vehicleTypeId",
            "type" => "string",
            "description" => "vehicleTypeIdHint",
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'services/services/' + serviceId",
        "urlParam" => "criteria"
    )
));

?>