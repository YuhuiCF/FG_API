<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "createOfferSearch",
    "description" => "create offer search",
    "basePath" => "/smp/api/offersearches",
    "fullPath" => "/smp/api/offersearches",
    "functionParams" => array(
        array(
            "parameterName" => "offerSearch",
            "ajaxCheck" => array("data"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "object",
            "description" => "use user search key and region to create an offer search; apitesterHint"
        ),
        array(
            "parameterName" => "userSearchConfigKey",
            "description" => "user search key",
            "isMandatory" => true,
            "type" => "object",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "region",
            "description" => "search offers in the given region",
            "type" => "object",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "generateEmptyOffer",
            "description" => "whether locations with no offer will be included in the result list",
            "type" => "boolean",
            "isAjaxDataKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'offersearches'",
        "data" => "offerSearch"// singleLine-value, for PUT and POST, will be stringified
        // ajaxcomplete();, ajaxsuccess();, ajaxerror();
    )
));

?>