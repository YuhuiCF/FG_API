<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "createUserSearch",
    "description" => "create user search",
    "basePath" => "/smp/api/usersearches",
    "fullPath" => "/smp/api/usersearches",
    "functionParams" => array(
        array(
            "parameterName" => "userSearchData",
            "ajaxCheck" => array("data"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "object",
            "description" => "use vehicle, and service to create a user search"
        ),
        array(
            "parameterName" => "selectedVehicle",
            "description" => "selected vehicle",
            "isMandatory" => true,
            "type" => "object",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "selectedServiceList",
            "description" => "list of selected services",
            "isMandatory" => true,
            "type" => "array of objects",
            "isAjaxDataKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'usersearches'",
        "data" => "userSearchData"// singleLine-value, for PUT and POST, will be stringified
        // ajaxcomplete();, ajaxsuccess();, ajaxerror();
    )
));

?>