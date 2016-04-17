<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findRegion",
    "description" => "find region",
    "basePath" => "/smp/api/regions",
    "fullPath" => "/smp/api/regions",
    "functionParams" => array(
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => "urlParam",
            "type" => "object",
            "description" => "search criteria; apitesterHint"
        ),
        array(
            "parameterName" => "searchTerm",
            "description" => "search term",
            "type" => "string",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => $FgApiLibrary -> functionQuickHandle,
            "ajaxCheck" => "success",
            "type" => "function(data)",
            "description" => $FgApiLibrary -> functionQuickHandle." function with parameter (data) of type array of objects.
                    The structure of each object in parameter data:
                        formattedName - string, formatted name of the region
                        nearbyLocationCount - number, number of nearby locations
                        signature - string, region signature"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'regions'",
        "urlParam" => "criteria",
        "success" => "function(data){
                    if (isType(".$FgApiLibrary -> functionQuickHandle.",'function')) {
                        var newData = [];
                        _.each(data,function(region){
                            newData.push({
                                formattedName: region.formattedName,
                                nearbyLocationCount: region.nearbyLocationCount,
                                signature: region.signature
                            });
                        });
                        ".$FgApiLibrary -> functionQuickHandle."(newData);
                    }
                    ajaxsuccess();
                }"
    )
));

?>
