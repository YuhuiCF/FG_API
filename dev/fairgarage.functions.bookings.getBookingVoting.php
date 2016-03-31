<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getBookingVoting",
    "description" => "get booking voting of web user",
    "basePath" => "/smp/api/bookings",
    "fullPath" => "/smp/api/bookings/{bookedOfferKey}/voting",
    "functionParams" => array(
        array(
            "parameterName" => "bookedOfferKey",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "booked offer key"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'bookings/' + bookedOfferKey + '/voting'"
    )
));

?>