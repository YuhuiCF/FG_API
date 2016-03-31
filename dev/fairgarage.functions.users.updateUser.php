<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "updateUser",
    "description" => "update FairGarage user information",
    "basePath" => "/smp/api/users",
    "fullPath" => "/smp/api/users/{userId}",
    "functionParams" => array(
        array(
            "parameterName" => "userData",
            "ajaxCheck" => array("data","apiUrl"),
            "isMandatory" => true,
            "type" => "object",
            "description" => "data of user; apitesterHint"
        ),
        array(
            "parameterName" => "id",
            "isMandatory" => true,
            "type" => "string",
            "description" => "ID of the user",
            "isAjaxDataKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'PUT'",
        "apiUrl" => "'users/' + userData.id",
        "data" => "userData"
        // ajaxcomplete(), ajaxsuccess(), ajaxerror()
    )
));

?>
