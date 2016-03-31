<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => $FgApiLibrary -> functionGetVehicleByVehicleTypeId,
    "description" => "get vehicle by vehicle type ID",
    "basePath" => "/smp/api/vehicles/vehicletypes",
    "fullPath" => "/smp/api/vehicles/vehicletypes/{id}",
    "functionParams" => array(
        array(
            "parameterName" => "vehicleTypeId",
            "isMandatory" => true,
            "ajaxCheck" => "apiUrl",// or "data" if only one value
            "type" => "string",
            "description" => "vehicleTypeIdHint"
        ),
        array(
            "parameterName" => $FgApiLibrary -> paramSaveVehicle,
            "ajaxCheck" => "success",
            "description" => "save the found vehicle, if only one vehicle is found, by ".$FgApiLibrary -> functionSetProperties." into \"vehicle\"",
            "type" => "boolean"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'vehicles/vehicletypes/' + vehicleTypeId",
        "success" => "function(data){
                    if (".$FgApiLibrary -> paramSaveVehicle." && data) {
                        var selectedVehicle = {
                            constructionTime: {time:null},
                            equipmentList: [],
                            vehicleType: data
                        };
                        var years = [];
                        for (var year in data.constructionTimeMap) {
                            years.push(year);
                        };
                        var year = years.sort()[0];
                        selectedVehicle.constructionTime.time = ".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionDateToTimestamp."(".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionGetFirstDateInConstructionTimeMap."(data.constructionTimeMap));
                        ".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionSetProperties."({selectedVehicle:selectedVehicle});
                    }
                    ajaxsuccess();
                }"
    )
));

?>