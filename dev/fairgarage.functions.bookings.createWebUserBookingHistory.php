<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "createWebUserBookingHistory",
    "description" => "create booking history by web user",
    "basePath" => "/smp/api/bookings",
    "fullPath" => "/smp/api/bookings/{bookedOfferKey}/history",
    "functionParams" => array(
        array(
            "parameterName" => "bookedOfferKey",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "booked offer key"
        ),
        array(
            "parameterName" => "historyData",
            "ajaxCheck" => array("data"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "object",
            "description" => "history data; apitesterHint"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'bookings/' + bookedOfferKey + '/history'",
        "data" => "historyData"
    )
));

?>