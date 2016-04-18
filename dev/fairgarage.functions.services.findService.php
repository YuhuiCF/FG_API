<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findService",
    "description" => "find service",
    "basePath" => "/smp/api/services/services",
    "fullPath" => "/smp/api/services/services",
    "functionParams" => array(
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => array("urlParam"),// or "data" if only one value
            "type" => "object",
            "description" => "search criteria; apitesterHint"
        ),
        array(
            "parameterName" => "searchTerm",
            "description" => "search term, name of the service",
            "type" => "string",
            "isUrlParamKey" => true
            // outputObj, functionParamObj, ajaxParamName, functionSetProperties, functionRemoveProperties, functionQuickHandle
        ),
        array(
            "parameterName" => "vehicleTypeId",
            "description" => "vehicleTypeIdHint",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "constructionTime",
            "description" => "constructionTimeHint",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "offset",
            "description" => "offsetHint",
            "type" => "number or string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "limit",
            "description" => "limitHint",
            "type" => "number or string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => $FgApiLibrary -> functionQuickHandle,
            "description" => $FgApiLibrary -> functionQuickHandle." function with parameter (data) of type array of objects
                    The structure of each object in parameter data:
                        serviceId - number, serviceIdHint
                        serviceName - string, name of the service",
            "type" => "function"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'services/services'",
        "urlParam" => "criteria",// singleLine-value, for GET
        "success" => "function(data){
                    if (isType(".$FgApiLibrary -> functionQuickHandle.",'function')) {
                        var newData = [];
                        helper.each(data,function(service){
                            newData.push({
                                serviceId: service.id,
                                serviceName: service.name
                            });
                        });
                        ".$FgApiLibrary -> functionQuickHandle."(newData);
                    }
                    ajaxsuccess();
                }"
        // ajaxcomplete(), ajaxsuccess(), ajaxerror()
    )
));

?>