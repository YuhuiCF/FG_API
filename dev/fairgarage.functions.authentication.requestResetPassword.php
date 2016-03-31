<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "requestResetPassword",
    "description" => "request reset password",
    "basePath" => "/smp/api/authentication/resetpassword",
    "fullPath" => "/smp/api/authentication/resetpassword",
    "functionParams" => array(
        array(
            "parameterName" => "userData",
            "ajaxCheck" => "data",
            "isMandatory" => true,
            "type" => "object",
            "description" => "data to send for requesting reset password"
        ),
        array(
            "parameterName" => "username",
            "isAjaxDataKey" => true,
            "isMandatory" => true,
            "type" => "string",
            "description" => "user name, or email address of the web user"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'authentication/resetpassword'",
        "data" => "userData"
    )
));

?>