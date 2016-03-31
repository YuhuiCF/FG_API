<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getOfferSearch",
    "description" => "get offer search",
    "basePath" => "/smp/api/offersearches",
    "fullPath" => "/smp/api/offersearches/{offerSearchKey}",
    "functionParams" => array(
        array(
            "parameterName" => "offerSearchKey",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "offer search key"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'offersearches/' + offerSearchKey"
    )
));

?>