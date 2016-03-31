<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getLocation",
    "description" => "get location",
    "basePath" => "/smp/api/locations",
    "fullPath" => "/smp/api/locations/{locationId}",
    "functionParams" => array(
        array(
            "parameterName" => "locationId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "semiMandatoryDefaultValue" => $FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionGetProperty."('locationId')",
            "type" => "string",
            "description" => "ID of the location; semiMandatoryValueHint"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'locations/' + locationId"
    )
));

?>