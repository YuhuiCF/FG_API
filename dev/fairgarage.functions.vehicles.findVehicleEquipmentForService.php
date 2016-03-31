<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findVehicleEquipmentForService",
    "description" => "find vehicle equipment for selected service",
    "basePath" => "/smp/api/vehicles/vehicletypes",
    "fullPath" => "/smp/api/vehicles/vehicletypes/{id}/equipments/{serviceId}/{constructionTime}",
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
        )/*,
        array(
            "parameterName" => $FgApiLibrary -> functionQuickHandle,
            "isMandatory" => false,
            "ajaxCheck" => "success",
            "type" => "function(data)",
            "description" => $FgApiLibrary -> functionQuickHandle." function with parameter (data) of type array of objects.
                    The structure of each object in parameter data:
                        name - name of the equipment
                        equipment - the equipment object
                        addEquipment - if this vehicle is stored as current vehicle in the FairGarage API object, use this function to add this selected equipment to the vehicle"
        )
        */
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'vehicles/vehicletypes/' + vehicleTypeId + '/equipments/' + serviceId + '/' + constructionTime"/*,
        "success" => "function(data){
                    if (isType(".$FgApiLibrary -> functionQuickHandle.",'function')) {
                        var newData = [];
                        $.each(data,function(){
                            newData.push({
                                name: this.name,
                                equipment: this,
                                addEquipment: function(){
                                    if (".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionGetProperty."('vehicle') && ".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionGetProperty."('vehicle').id == vehicleTypeId) {

                                    }
                                }
                            })
                        });
                    }
                    ajaxsuccess();
                }"
        */
    )
));

?>