<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getOfferForwarURL",
    "description" => "get offer forward URL",
    "basePath" => "/smp/api/locations",
    "fullPath" => "/smp/api/locations/{locationId}/forward",
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
        "apiUrl" => "'locations/' + locationId + '/forward'"
        // ajaxcomplete();, ajaxsuccess();, ajaxerror();
    )
));

?>