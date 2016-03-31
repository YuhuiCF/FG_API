<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findServiceByCatalog",
    "description" => "find service by catalog",
    "basePath" => "/smp/api/services/catalog",
    "fullPath" => "/smp/api/services/catalog/{serviceCategoryId}",
    "functionParams" => array(
        array(
            "parameterName" => "serviceCategoryId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "ID of service category"
        ),
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => array("urlParam"),// or "data" if only one value
            "type" => "object",
            "description" => "search criteria; apitesterHint"
        ),
        array(
            "parameterName" => "constructionTime",
            "description" => "constructionTimeHint",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "vehicleTypeId",
            "description" => "vehicleTypeIdHint",
            "type" => "string",
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'services/catalog/' + serviceCategoryId",
        "urlParam" => "criteria"
    )
));

?>