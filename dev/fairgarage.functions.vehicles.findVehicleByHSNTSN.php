<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findVehicleByHSNTSN",
    "description" => "find vehicle by HSN/TSN of the vehicle",
    "basePath" => "/smp/api/vehicles/vehicletypes",
    "fullPath" => "/smp/api/vehicles/vehicletypes",
    "functionParams" => array(
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => "urlParam",// or "data" if only one value
            "type" => "object",
            "isMandatory" => true,
            "description" => "search criteria; apitesterHint"
        ),
        array(
            "parameterName" => "hsn",
            "description" => "HSN of the vehicle",
            "type" => "string",
            "isMandatory" => true,
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "tsn",
            "description" => "TSN of the vehicle",
            "type" => "string",
            "isMandatory" => true,
            "isUrlParamKey" => true
        ),
        /*
        array(
            "parameterName" => "hsn",
            "ajaxCheck" => "urlParam",
            "description" => "HSN of the vehicle",
            "type" => "string",
            "isMandatory" => true
        ),
        array(
            "parameterName" => "tsn",
            "ajaxCheck" => "urlParam",
            "description" => "TSN of the vehicle",
            "type" => "string",
            "isMandatory" => true
        ),
        */
        array(
            "parameterName" => $FgApiLibrary -> paramSaveVehicle,
            "ajaxCheck" => "success",
            "description" => "save the found vehicle, if only one vehicle is found, by ".$FgApiLibrary -> functionSetProperties." into \"vehicle\"",
            "type" => "boolean"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'vehicles/vehicletypes'",
        "urlParam" => "criteria",// singleLine-value, for GET
        //"urlParam" => "{hsn:hsn,tsn:tsn}",// singleLine-value, for GET
        "success" => "function(data){
                    if (".$FgApiLibrary -> paramSaveVehicle." && data.length == 1) {
                        var selectedVehicle = {
                            constructionTime: {time:null},
                            equipmentList: [],
                            vehicleType: data[0]
                        };
                        var years = [];
                        for (var year in data[0].constructionTimeMap) {
                            years.push(year);
                        };
                        var year = years.sort()[0];
                        selectedVehicle.constructionTime.time = ".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionDateToTimestamp."(year + '-' + (data[0].constructionTimeMap[year].sort(function(a,b){return a-b})[0]));
                        ".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionSetProperties."({selectedVehicle:selectedVehicle});
                    }
                    ajaxsuccess();
                }"
    )
));

?>