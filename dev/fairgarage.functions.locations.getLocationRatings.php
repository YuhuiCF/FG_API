<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getLocationRatings",
    "description" => "get location ratings",
    "basePath" => "/smp/api/locations",
    "fullPath" => "/smp/api/locations/{locationId}/voting",
    "functionParams" => array(
        array(
            "parameterName" => "locationId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "type" => "string or number",
            "isMandatory" => true,
            "description" => "locationIdHint",
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'locations/' + locationId + '/voting'"
        // ajaxcomplete();, ajaxsuccess();, ajaxerror();
    )
));

?>