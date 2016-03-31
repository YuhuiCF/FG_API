<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "createBookingVoting",
    "description" => "create booking voting by web user",
    "basePath" => "/smp/api/bookings",
    "fullPath" => "/smp/api/bookings/{bookedOfferKey}/voting",
    "functionParams" => array(
        array(
            "parameterName" => "bookedOfferKey",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "booked offer key"
        ),
        array(
            "parameterName" => "votingData",
            "ajaxCheck" => array("data"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "object",
            "description" => "voting data; apitesterHint"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'bookings/' + bookedOfferKey + '/voting'",
        "data" => "votingData"
    )
));

?>