<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findEquipmentsForVehicleAndService",
    "description" => "find equipments for vehicle and selected service",
    "basePath" => "/smp/api/vehicles/vehicletypes",
    "fullPath" => "/smp/api/vehicles/vehicletypes/{id}/equipments",
    "functionParams" => array(
        array(
            "parameterName" => "vehicleTypeId",
            "isMandatory" => true,
            "ajaxCheck" => "apiUrl",// or "data" if only one value
            "type" => "string",
            "description" => "vehicleTypeIdHint"
        ),
        array(
            "parameterName" => "serviceId",
            "isMandatory" => true,
            "ajaxCheck" => "apiUrl",// or "data" if only one value
            "type" => "string",
            "description" => "serviceIdHint"
        ),
        array(
            "parameterName" => "constructionTime",
            "isMandatory" => true,
            "ajaxCheck" => "apiUrl",// or "data" if only one value
            "type" => "string",
            "description" => "constructionTimeHint"
        ),
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'vehicles/vehicletypes/' + vehicleTypeId + '/equipments/' + serviceId + '/' + constructionTime"
    )
));

?>