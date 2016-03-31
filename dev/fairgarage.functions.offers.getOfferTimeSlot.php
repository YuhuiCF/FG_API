<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getOfferTimeSlot",
    "description" => "get time slot for offer with offer key",
    "basePath" => "/smp/api/offers",
    "fullPath" => "/smp/api/offers/{offerKey}/timeslot",
    "functionParams" => array(
        array(
            "parameterName" => "offerKey",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "offer key"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'offers/' + offerKey + '/timeslot'",
        "urlParam" => "criteria"
    )
));

?>