<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "checkLoginStatus",
    "description" => "check login status",
    "basePath" => "/smp/api/authentication/current",
    "fullPath" => "/smp/api/authentication/current",
    "functionParams" => array(
        array(
            "parameterName" => "isLoggedIn",
            "ajaxCheck" => "success",
            "type" => "function()",
            "description" => "function to excecute if user is logged in"
        ),
        array(
            "parameterName" => "isNotLoggedIn",
            "ajaxCheck" => array("success","error"),
            "type" => "function()",
            "description" => "function to excecute if user is not logged in or session expired"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'authentication/current'",
        "success" => "function(data){
                    if (data.sessionId) {
                        ".$FgApiLibrary -> varPrivate.".sessionId = data.sessionId;
                        if (isType(isLoggedIn,'function')) {
                            isLoggedIn();
                        }
                    } else {
                        delete ".$FgApiLibrary -> varPrivate.".sessionId;
                        if (isType(isNotLoggedIn,'function')) {
                            isNotLoggedIn();
                        }
                    }
                    ajaxsuccess();
                }",
        "error" => "function(jqXHR,textStatus,errorThrown){
                    delete ".$FgApiLibrary -> varPrivate.".sessionId;
                    if (isType(isNotLoggedIn,'function')) {
                        isNotLoggedIn();
                    }
                    ajaxerror();
                }"
    )
));

?>