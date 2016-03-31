<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "createMailTemplate",
    "description" => "create mail template",
    "basePath" => "/smp/api/mailconfigs",
    "fullPath" => "/smp/api/mailconfigs/{mailconfigId}/templates",
    "functionParams" => array(
        array(
            "parameterName" => "mailTemplate",
            "ajaxCheck" => array("data"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "object",
            "description" => "mail template; apitesterHint"
        ),
        array(
            "parameterName" => "mailConfigId",
            "ajaxCheck" => "apiUrl",
            "description" => "ID of the mail configuration",
            "type" => "string",
            "isMandatory" => true,
            "isAjaxDataKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'mailconfigs/' + mailTemplate.mailConfigId + '/templates'",
        "data" => "mailTemplate"
        // ajaxcomplete(), ajaxsuccess(), ajaxerror()
    )
));

?>