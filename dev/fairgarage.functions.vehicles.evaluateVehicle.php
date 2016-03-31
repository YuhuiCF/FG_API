<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "evaluateVehicle",
    "description" => "evaluate a vehicle",
    "basePath" => "/smp/api/vehicles/evaluation",
    "fullPath" => "/smp/api/vehicles/evaluation",
    "functionParams" => array(
        array(
            "parameterName" => "valuatedVehicle",
            "isMandatory" => true,
            "ajaxCheck" => array("data"),
            "type" => "object",
            "description" => "vehicle information for the evaluation"
        ),
        array(
            "parameterName" => "datVehicleContainer",
            "isMandatory" => true,
            "isAjaxDataKey" => true,
            "ajaxCheck" => array("data"),
            "type" => "object",
            "description" => "vehicle information used for the DAT evaluation; apitesterHint
                        The basic structure of this object datVehicleContainer:
                            {object} vehicleType - vehicle type, the vehicle object returned by FairGarage API, by any searching method
                            {object} registrationDate - registration date
                                {number} time - registration date of the current vehicle, in timestamp
                            {number} milage - milage of the vehicle, please indicate the value in kilometer (km)"
        ),
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => array("urlParam"),
            "type" => "object",
            "description" => "search criteria; apitesterHint"
        ),
        array(
            "parameterName" => "languageCode",
            "isUrlParamKey" => true,
            "type" => "string",
            "description" => "languageCodeHint",
        ),
        array(
            "parameterName" => "countryCode",
            "isUrlParamKey" => true,
            "type" => "string",
            "description" => "countryCodeHint",
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'vehicles/evaluation'",
        "urlParam" => "criteria",
        "data" => "extend(true,{datVehicleContainer:{registrationDate:{time:".$FgApiLibrary -> outputObj.".dateToTimestamp(".$FgApiLibrary -> outputObj.".getFirstDateInConstructionTimeMap(valuatedVehicle.datVehicleContainer.vehicleType.constructionTimeMap))}}},valuatedVehicle)"
    )
));

?>