<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getRegionBySignature",
    "description" => "get region by region signature",
    "basePath" => "/smp/api/regions/signature",
    "fullPath" => "/smp/api/regions/signature/{signature}",
    "functionParams" => array(
        array(
            "parameterName" => "signature",
            "isMandatory" => true,
            "ajaxCheck" => "apiUrl",
            "type" => "string",
            "description" => "region signature"
        ),
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
        "apiUrl" => "'regions/signature/' + signature",
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
