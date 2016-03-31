<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "checkSession",
    "description" => "check session",
    "basePath" => "/smp/api/authentication/current_session",
    "fullPath" => "/smp/api/authentication/current_session",
    "functionParams" => array(
        array(
            "parameterName" => "isSessionNotExpired",
            "ajaxCheck" => "success",
            "type" => "function()",
            "description" => "function to excecute if user is logged in"
        ),
        array(
            "parameterName" => "isSessionExpired",
            "ajaxCheck" => array("success","error"),
            "type" => "function()",
            "description" => "function to excecute if user is not logged in or session expired"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'authentication/current_session'",
        "success" => "function(data){
                    if (data && data.sessionId) {
                        ".$FgApiLibrary -> varPrivate.".sessionId = data.sessionId;
                        if (isType(isSessionNotExpired,'function')) {
                            isSessionNotExpired();
                        }
                    } else {
                        delete ".$FgApiLibrary -> varPrivate.".sessionId;
                        if (isType(isSessionExpired,'function')) {
                            isSessionExpired();
                        }
                    }
                    ajaxsuccess();
                }",
        "error" => "function(jqXHR,textStatus,errorThrown){
                    delete ".$FgApiLibrary -> varPrivate.".sessionId;
                    if (isType(isSessionExpired,'function')) {
                        isSessionExpired();
                    }
                    ajaxerror();
                }"
    )
));

?>