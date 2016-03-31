<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getWebUserBookingHistories",
    "description" => "get web user booking histories",
    "basePath" => "/smp/api/bookings",
    "fullPath" => "/smp/api/bookings/{bookedOfferKey}/history",
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
        "apiUrl" => "'bookings/' + bookedOfferKey + '/history'"
    )
));

?>