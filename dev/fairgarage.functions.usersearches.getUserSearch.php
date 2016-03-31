<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getUserSearch",
    "description" => "get user search",
    "basePath" => "/smp/api/usersearches",
    "fullPath" => "/smp/api/usersearches/{userSearchKey}",
    "functionParams" => array(
        array(
            "parameterName" => "userSearchKey",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "user search key"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'usersearches/' + userSearchKey"
    )
));

?>