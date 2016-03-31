<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getOffer",
    "description" => "get offer by offer key",
    "basePath" => "/smp/api/offers",
    "fullPath" => "/smp/api/offers/{offerKey}/details",
    "functionParams" => array(
        array(
            "parameterName" => "offerKey",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "offer key"
        ),
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => array("urlParam"),
            "type" => "object",
            "description" => "criteria to show the offer; apitesterHint"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'offers/' + offerKey + '/details'",
        "urlParam" => "criteria"
    )
));

?>