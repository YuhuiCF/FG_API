<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getRegionOfUser",
    "description" => "get region of the user",
    "basePath" => "/smp/api/regions/default",
    "fullPath" => "/smp/api/regions/default",
    "functionParams" => array(
        array(
            "parameterName" => $FgApiLibrary -> functionQuickHandle,
            "ajaxCheck" => "success",
            "type" => "function(data)",
            "description" => $FgApiLibrary -> functionQuickHandle." function with parameter (data) of type object.
                    The structure of the parameter data:
                        formattedName - string, formatted name of the region
                        nearbyLocationCount - number, number of nearby locations
                        signature - string, region signature"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'regions/default'",
        "success" => "function(data){
                    if (isType(".$FgApiLibrary -> functionQuickHandle.",'function')) {
                        newData = {
                            formattedName: data.formattedName,
                            nearbyLocationCount: data.nearbyLocationCount,
                            signature: data.signature
                        };
                        ".$FgApiLibrary -> functionQuickHandle."(newData);
                    }
                    ajaxsuccess();
                }"
    )
));

?>
