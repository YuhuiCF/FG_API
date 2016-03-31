<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "setPassword",
    "description" => "set password",
    "basePath" => "/smp/api/authentication/resetpassword",
    "fullPath" => "/smp/api/authentication/resetpassword",
    "functionParams" => array(
        array(
            "parameterName" => "passwordData",
            "ajaxCheck" => "data",
            "isMandatory" => true,
            "type" => "object",
            "description" => "data to send for setting password"
        ),
        array(
            "parameterName" => "username",
            "isAjaxDataKey" => true,
            "isMandatory" => true,
            "type" => "string",
            "description" => "user name, or email address of the web user"
        ),
        array(
            "parameterName" => "token",
            "isAjaxDataKey" => true,
            "isMandatory" => true,
            "type" => "string",
            "description" => "token for setting password"
        ),
        array(
            "parameterName" => "newPassword",
            "isAjaxDataKey" => true,
            "isMandatory" => true,
            "type" => "string",
            "description" => "new password"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'authentication/resetpassword'",
        "data" => "passwordData"
    )
));

?>