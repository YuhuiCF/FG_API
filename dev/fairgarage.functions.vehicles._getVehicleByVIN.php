<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getVehicleByVIN",
    "description" => "get vehicle by VIN",
    "basePath" => "/smp/api/vehicles/vehicles",
    "fullPath" => "/smp/api/vehicles/vehicles/{vin}",
    "functionParams" => array(
        array(
            "parameterName" => "vin",
            "isMandatory" => true,
            "ajaxCheck" => "apiUrl",// or "data" if only one value
            "type" => "string",
            "description" => "VIN of the vehicle"
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
        "apiUrl" => "'vehicles/vehicles/' + vin",
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
                        selectedVehicle.constructionTime.time = (criteria && criteria.constructionTime) ? ".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionDateToTimestamp."(criteria.constructionTime) : ".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionDateToTimestamp."(year + '-' + (data.constructionTimeMap[year].sort(function(a,b){return a-b})[0]));
                        ".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionSetProperties."({selectedVehicle:selectedVehicle});
                    }
                    ajaxsuccess();
                }"
    )
));

?>