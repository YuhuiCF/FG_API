<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findVehicleByCatalog",
    "description" => "find vehicle by catalog",
    "basePath" => "/smp/api/vehicles/catalog",
    "fullPath" => "/smp/api/vehicles/catalog/{vehicleCategoryId}",
    "functionParams" => array(
        array(
            "parameterName" => "vehicleCategoryId",
            "ajaxCheck" => "apiUrl",
            //"isMandatory" => true,
            "semiMandatoryDefaultValue" => "'62303'",
            "type" => "string",
            "description" => "vehicle category ID. To find IDs of the next category, start with \"62303\" (default) for SUV/passenger cars, or \"83503\" for transporters"
        ),
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => array("urlParam","success"),
            "type" => "object",
            "description" => "search criteria; apitesterHint"
        ),
        array(
            "parameterName" => "constructionTime",
            "ajaxCheck" => array("success"),
            "isUrlParamKey" => true,
            "type" => "string",
            "description" => "constructionTimeHint",
        ),
        array(
            "parameterName" => $FgApiLibrary -> functionQuickHandle,
            "ajaxCheck" => "success",
            "type" => "function(data)",
            "description" => $FgApiLibrary -> functionQuickHandle." function with parameter (data) of type array of objects.
                    The structure of each object in the parameter data:
                        {boolean} lastLevel - if the last category level is reached
                        {number} id - ID of the category; or ID of the vehicle type (if the last level is reached)
                        {string} name - name of the category
                        {string} externalId - external ID or Ecode of the vehicle (if the last level is reached)
                        {array of objects} properties - each of which are objects of the vehicle (if the last level is reached)
                            The structure of each property object:
                                {string} name - name of the property
                                {string} value - value of the property"
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
        "apiUrl" => "'vehicles/catalog/' + vehicleCategoryId",
        "urlParam" => "criteria",
        "success" => "function(data){
                    "./*"if (data.categories && data.categories.length == 0 && data.types && data.types.length == 0 && data.ancestors && data.ancestors.length > 0) {
                        ".$FgApiLibrary -> outputObj.".error('The requested ID ' + categoryId + ' is not a valid category ID. This might be an ID of vehicle type. Please try to use function ".$FgApiLibrary -> functionGetVehicleByVehicleTypeId."().');
                        return;
                    }
                    ".*/"if (".$FgApiLibrary -> paramSaveVehicle." && data.types.length == 1) {
                        var selectedVehicle = {
                            constructionTime: {time:null},
                            equipmentList: [],
                            vehicleType: data.types[0]
                        };
                        var years = [];
                        for (var year in data.types[0].constructionTimeMap) {
                            years.push(year);
                        }
                        var thisYear = years.sort()[0];
                        selectedVehicle.constructionTime.time = (criteria && criteria.constructionTime) ? ".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionDateToTimestamp."(criteria.constructionTime) : ".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionDateToTimestamp."(thisYear + '-' + (data.types[0].constructionTimeMap[thisYear].sort(function(a,b){return a-b;})[0]));
                        //selectedVehicle.constructionTime.time = (criteria && criteria.constructionTime) ? ".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionDateToTimestamp."(criteria.constructionTime) : ".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionDateToTimestamp."(".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionGetFirstDateInConstructionTimeMap."(data.types[0].constructionTimeMap)));
                        ".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionSetProperties."({selectedVehicle:selectedVehicle});
                    }
                    if (isType(".$FgApiLibrary -> functionQuickHandle.",'function')) {
                        var newData = [];
                        var key = 'categories';
                        if (data.types.length > 0) {
                            key = 'types';
                        }
                        _.each(data[key],function(vehicleType){
                            newData.push({
                                lastLevel: key === 'types',
                                id: vehicleType.id,
                                name: vehicleType.name,
                                externalId: (key === 'types' ? vehicleType.externalId : null),
                                properties: []
                            });
                            _.each(vehicleType.properties,function(property){
                                newData[newData.length - 1].properties.push({
                                    name: property.type.name,
                                    value: property.value
                                });
                            });
                        });
                        ".$FgApiLibrary -> functionQuickHandle."(newData);
                    }
                    ajaxsuccess();
                }"
    )
));

?>