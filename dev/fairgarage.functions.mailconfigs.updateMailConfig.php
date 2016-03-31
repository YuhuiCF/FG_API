<?php
        
$FgApiLibrary -> addFunction(array(
    "functionName" => "updateMailConfig",
    "description" => "update mail configuration",
    "basePath" => "/smp/api/mailconfigs",
    "fullPath" => "/smp/api/mailconfigs/{id}",
    "functionParams" => array(
        array(
            "parameterName" => "mailConfig",
            "ajaxCheck" => array("data"),
            "isMandatory" => true,
            "type" => "object",
            "description" => "mail configuration; apitesterHint"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'PUT'",
        "apiUrl" => "'mailconfigs/' + mailConfig.id",
        "data" => "mailConfig"
        // ajaxcomplete();, ajaxsuccess();, ajaxerror();
    )
));

?>