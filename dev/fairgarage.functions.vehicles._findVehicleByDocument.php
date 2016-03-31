<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findVehicleByDocument",
    "description" => "find vehicle by documents, either externalId, or both hsn and tsn must be given in criteria",
    "basePath" => "/smp/api/vehicles/vehicletypes",
    "fullPath" => "/smp/api/vehicles/vehicletypes",
    "functionParams" => array(
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => "urlParam",// or "data" if only one value
            "type" => "object",
            "isMandatory" => false,
            "description" => "search criteria; apitesterHint"
        ),
        array(
            "parameterName" => "externalId",
            "description" => "external ID or Ecode of the vehicle",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "hsn",
            "description" => "HSN of the vehicle",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "tsn",
            "description" => "TSN of the vehicle",
            "type" => "string",
            "isUrlParamKey" => true
        )/*,
        array(
            "parameterName" => $FgApiLibrary -> paramSaveVehicle,
            "ajaxCheck" => "success",
            "description" => "save the found vehicle, if only one vehicle is found, by ".$FgApiLibrary -> functionSetProperties." into \"vehicle\"",
            "type" => "boolean"
        )*/
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'vehicles/vehicletypes'",
        "urlParam" => "criteria"/*,
        "success" => "function(data){
                    if (".$FgApiLibrary -> paramSaveVehicle." && data.length == 1 && data[0] != null) {
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
                }"*/
    )
));

?>