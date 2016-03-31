<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "isLocationBookableOnline",
    "description" => "is location bookable online",
    "basePath" => "/smp/api/locations",
    "fullPath" => "/smp/api/locations/{locationId}/online/bookings",
    "functionParams" => array(
        array(
            "parameterName" => "locationId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "type" => "number or string",
            "description" => "locationIdHint",
            "isMandatory" => true
        ),
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => array("urlParam"),// or "data" if only one value
            "type" => "object",
            "description" => "search criteria; apitesterHint",
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'locations/' + locationId + '/online/bookings'",
        "urlParam" => "criteria"
        // ajaxcomplete();, ajaxsuccess();, ajaxerror();
    )
));

?>