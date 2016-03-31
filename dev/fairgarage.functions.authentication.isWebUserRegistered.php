<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "isWebUserRegistered",
    "description" => "is password required for the web user",
    "basePath" => "/smp/api/authentication/login/webuser",
    "fullPath" => "/smp/api/authentication/login/webuser",
    "functionParams" => array(
        array(
            "parameterName" => "criteria",
            "type" => "object",
            "ajaxCheck" => "urlParam",
            "description" => "search criteria",
            "isMandatory" => true
        ),
        array(
            "parameterName" => "username",
            "type" => "string",
            "description" => "username, or email address of the web user",
            "isMandatory" => true,
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "isWebUserRegistered",
            "type" => "function",
            "description" => "function to excecute, if password is required. Is is suggested to ask the user to login in this case"
        ),
        array(
            "parameterName" => "isWebUserNotRegistered",
            "type" => "function",
            "description" => "function to excecute, if password is not required"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'authentication/login/webuser'",
        "urlParam" => "criteria",
        "success" => "function(data){
                    if (data && data.requirePassword) {
                        if (isType(isWebUserRegistered,'function')) {
                            isWebUserRegistered();
                        }
                    } else {
                        if (isType(isWebUserNotRegistered,'function')) {
                            isWebUserNotRegistered();
                        }
                    }
                    ajaxsuccess();
                }"
    )
));

?>
