<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getAllEquipmentsForVehicle",
    "description" => "get all equipments for vehicle",
    "basePath" => "/smp/api/vehicles/vehicletypes",
    "fullPath" => "/smp/api/vehicles/vehicletypes/{id}/equipments",
    "functionParams" => array(
        array(
            "parameterName" => "vehicleTypeId",
            "isMandatory" => true,
            "ajaxCheck" => "apiUrl",// or "data" if only one value
            "type" => "string",
            "description" => "vehicleTypeIdHint"
        )
        /*,
        array(
            "parameterName" => $FgApiLibrary -> functionQuickHandle,
            "isMandatory" => false,
            "ajaxCheck" => "success",
            "type" => "function(data)",
            "description" => $FgApiLibrary -> functionQuickHandle." function with parameter (data) of type array of objects.
                    The structure of each object in parameter data:
                        "
        )
        */
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'vehicles/vehicletypes/' + vehicleTypeId + '/equipments'"
    )
));

?>