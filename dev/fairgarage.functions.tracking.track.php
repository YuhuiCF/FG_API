<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "track",
    "description" => "FG internal tracking",
    "basePath" => "/smp/api/tracking/json",// FG API path info
    "fullPath" => "/smp/api/tracking/json",// FG API path info
    "functionParams" => array(
        array(
            "parameterName" => "trackingData",
            "ajaxCheck" => array("data"),// or "data" if only one value. This field is used to remind you that this parameter should be used in which key of the ajax key in the function parameter
            "isMandatory" => true,
            "type" => "object",
            "description" => "The info summarizing the event to be tracked; apitesterHint"// the ***Hint are variables in the FgApiLibrary object, such that these descriptions could be "shared"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'tracking/json'",
        "data" => "trackingData"// singleLine-value, for PUT and POST, will be automatically stringified
        // these expressions are some short-hand keywords to replace the client-defined complete(), success(), and error()
        // ajaxcomplete();, ajaxsuccess();, ajaxerror();
    )
));

?>