<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getMailConfig",
    "description" => "get mail configuration",
    "basePath" => "/smp/api/mailconfigs",
    "fullPath" => "/smp/api/mailconfigs/{id}",
    "functionParams" => array(
        array(
            "parameterName" => "mailConfigId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "ID of the mail configuration"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'mailconfigs/' + mailConfigId"
        // ajaxcomplete();, ajaxsuccess();, ajaxerror();
    )
));

?>