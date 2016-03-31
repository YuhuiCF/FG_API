<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getAllInspectionServicePositions",
    "description" => "get all inspection service positions",
    "basePath" => "/smp/api/services/servicepositions",
    "fullPath" => "/smp/api/services/servicepositions/{serviceId}/{vehicleTypeId}/{constructionTime}",
    "functionParams" => array(
        array(
            "parameterName" => "vehicleTypeId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string or number",
            "description" => "vehicleTypeIdHint"
        ),
        array(
            "parameterName" => "serviceId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string or number",
            "description" => "ID of the inspection service"
        ),
        array(
            "parameterName" => "constructionTime",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "constructionTimeHint"
        ),
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => array("urlParam"),// or "data" if only one value
            "type" => "object",
            "description" => "search criteria; apitesterHint"
        ),
        array(
            "parameterName" => "equipmentCodes",
            "description" => "equipment code of the vehicle",
            "isMandatory" => false,
            "type" => "string",
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'services/servicepositions/' + serviceId + '/' + vehicleTypeId + '/' + constructionTime",
        "urlParam" => "criteria"
    )
));

?>