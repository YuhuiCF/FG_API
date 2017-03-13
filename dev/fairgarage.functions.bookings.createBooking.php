<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "createBooking",
    "description" => "create booking for web user",
    "basePath" => "/smp/api/bookings",
    "fullPath" => "/smp/api/bookings",
    "functionParams" => array(
        array(
            "parameterName" => "bookingData",
            "ajaxCheck" => array("data"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "object",
            "description" => "data of booking to be passed"
        ),
        array(
            "parameterName" => "offerKey",
            "description" => "key of the offer to be booked",
            "isMandatory" => true,
            "type" => "string",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "givenname",
            "description" => "given name of the customer",
            "isMandatory" => true,
            "type" => "string",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "surname",
            "description" => "surname of the customer",
            "isMandatory" => true,
            "type" => "string",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "emailAddress",
            "description" => "email address of the customer",
            "isMandatory" => true,
            "type" => "string",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "phone",
            "description" => "phone number of the customer",
            "isMandatory" => true,
            "type" => "string",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "dropoffFrom",
            "description" => "time stamp, to indicate drop off from which time",
            "isMandatory" => true,
            "type" => "string or number",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "dropoffTo",
            "description" => "time stamp, to indicate drop off to which time",
            "isMandatory" => true,
            "type" => "string or number",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "mileage",
            "description" => "mileage of the vehicle",
            "isMandatory" => false,
            "type" => "string or number",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "licenseNumber",
            "description" => "license number of the vehicle",
            "isMandatory" => false,
            "type" => "string",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => array("urlParam"),// or "data" if only one value
            "isMandatory" => false,
            "type" => "object",
            "description" => "data of booking to be passed, like additional services, and part qualities"
        ),
        array(
            "parameterName" => "additionalServiceConfig",
            "ajaxCheck" => "urlParam",
            "description" => "service ID of additional service",
            "isMandatory" => false,
            "type" => "string",
            "isUrlParamKey" => true
            // here are some object fields that are required to use in constructing the FG library
            // outputObj, functionParamObj, ajaxParamName, functionSetProperties, functionGetProperty, functionRemoveProperty, functionQuickHandle
        ),
        array(
            "parameterName" => "partQualityConfig",
            "ajaxCheck" => "urlParam",
            "description" => "part quality type ID of the offer",
            "isMandatory" => false,
            "type" => "string",
            "isUrlParamKey" => true
            // here are some object fields that are required to use in constructing the FG library
            // outputObj, functionParamObj, ajaxParamName, functionSetProperties, functionGetProperty, functionRemoveProperty, functionQuickHandle
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'bookings'",
        "data" => "bookingData",
        "urlParam" => "helper.assign(criteria,{status:{name:'BOOKED'}})"
    )
));

?>