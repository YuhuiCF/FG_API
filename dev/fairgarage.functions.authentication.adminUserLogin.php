<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "adminUserLogin",
    "description" => "login for admin user",
    "basePath" => "/smp/api/authentication/login/admin",
    "fullPath" => "/smp/api/authentication/login/admin",
    "functionParams" => array(
        array(
            "parameterName" => "loginData",
            "ajaxCheck" => "data",
            "type" => "object",
            "description" => "data of login",//; apitesterHint
            "isMandatory" => true
        ),
        array(
            "parameterName" => "username",
            "type" => "string",
            "description" => "username",
            "isMandatory" => true,
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "password",
            "type" => "string",
            "description" => "password",
            "isMandatory" => true,
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "locationId",
            "type" => "string or number",
            "description" => "locationIdHint",//, semiMandatoryValueHint
            //"semiMandatoryDefaultValue" => "''",
            "isAjaxDataKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'authentication/login/admin'",
        "data" => "loginData",
        "success" => "function(data){
                    ".$FgApiLibrary -> varPrivate.".".$FgApiLibrary -> sessionId." = data.sessionId;
                    ajaxsuccess();
                }"
    )
));

?>
