<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getOfferEmail",
    "description" => "get email template, used to send the offer",
    "basePath" => "/smp/api/offers",
    "fullPath" => "/smp/api/offers/{offerKey}/mailcontent",
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
        "apiUrl" => "'offers/list/' + offerKey + '/mailcontent'",
        "urlParam" => "criteria"
    )
));

?>