<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findTopServiceForVehicle",
    "description" => "find top services for vehicle with ID of vehicle type",
    "basePath" => "/smp/api/services/services/top",
    "fullPath" => "/smp/api/services/services/top/{vehicleTypeId}",
    "functionParams" => array(
        array(
            "parameterName" => "vehicleTypeId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "vehicleTypeIdHint"
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
            "parameterName" => "offset",
            "description" => "offsetHint",
            "type" => "number or string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "limit",
            "description" => "limitHint",
            "type" => "number or string",
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'services/services/top/' + vehicleTypeId",
        "urlParam" => "criteria"
    )
));

?>