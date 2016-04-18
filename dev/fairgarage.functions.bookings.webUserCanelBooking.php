<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "webUserCanelBooking",
    "description" => "cancel booking by web user",
    "basePath" => "/smp/api/bookings",
    "fullPath" => "/smp/api/bookings/{bookedOfferKey}/history",
    "functionParams" => array(
        array(
            "parameterName" => "bookedOfferKey",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "bookedOfferKeyHint"
        ),
        array(
            "parameterName" => "cancellingData",
            "ajaxCheck" => array("urlParam"),// or "data" if only one value
            "isMandatory" => false,
            "type" => "object",
            "description" => "data of booking to be passed; apitesterHint"
        ),
        array(
            "parameterName" => "comment",
            "description" => "key of the offer to be booked",
            "isMandatory" => false,
            "type" => "string",
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'bookings/' + bookedOfferKey + '/history'",
        "urlParam" => "helper.assign(cancellingData,{newStatus:'CANCELLED'})"
    )
));

?>