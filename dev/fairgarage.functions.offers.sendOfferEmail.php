<?php
        
$FgApiLibrary -> addFunction(array(
    "functionName" => "sendOfferEmail",
    "description" => "send the offer with the email template",
    "basePath" => "/smp/api/offers",
    "fullPath" => "/smp/api/offers/{offerKey}/mail",
    "functionParams" => array(
        array(
            "parameterName" => "offerKey",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "offer key"
        ),
        array(
            "parameterName" => "offerMail",
            "ajaxCheck" => array("data"),
            "isMandatory" => true,
            "type" => "object",
            "description" => "offer email; apitesterHint"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'offers/list/' + offerKey + '/mail'",
        "data" => "offerMail"
    )
));

?>