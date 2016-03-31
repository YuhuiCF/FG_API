<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "locationUserLogin",
    "description" => "login for location user, please use your DAT login, or your FairGarage login and your location ID, or with token",
    "basePath" => "/smp/api/authentication/login/locationuser",
    "fullPath" => "/smp/api/authentication/login/locationuser",
    "functionParams" => array(
        array(
            "parameterName" => "loginData",
            "ajaxCheck" => "data",
            "type" => "object",
            "description" => "data of login; apitesterHint",
            "isMandatory" => true
        ),
        array(
            "parameterName" => "username",
            "type" => "string",
            "description" => "username, semiMandatoryValueHint",
            "semiMandatoryDefaultValue" => "''",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "password",
            "type" => "string",
            "description" => "password, semiMandatoryValueHint",
            "semiMandatoryDefaultValue" => "''",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "datCustomerNumber",
            "type" => "string or number",
            "description" => "DAT customer number, semiMandatoryValueHint",
            "semiMandatoryDefaultValue" => "''",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "authToken",
            "type" => "string",
            "description" => "authentication token, semiMandatoryValueHint",
            "semiMandatoryDefaultValue" => "''",
            "isAjaxDataKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'authentication/login/locationuser'",
        "data" => "loginData",
        "success" => "function(data){
                    ".$FgApiLibrary -> varPrivate.".".$FgApiLibrary -> sessionId." = data.sessionId;
                    ajaxsuccess();
                }"
    )
));

?>
