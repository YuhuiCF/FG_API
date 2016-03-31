<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getVehicleCategory",
    "description" => "get vehicle category",
    "basePath" => "/smp/api/vehicles/vehiclecategories",
    "fullPath" => "/smp/api/vehicles/vehiclecategories/{vehicleCategoryId}",
    "functionParams" => array(
        array(
            "parameterName" => "vehicleCategoryId",
            "ajaxCheck" => "apiUrl",
            "isMandatory" => true,
            "type" => "string or number",
            "description" => "vehicle category ID"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'vehicles/vehiclecategories/' + vehicleCategoryId"
    )
));

?>