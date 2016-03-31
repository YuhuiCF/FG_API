<?php
        
$FgApiLibrary -> addFunction(array(
    "functionName" => "updateMailTemplate",
    "description" => "update mail template",
    "basePath" => "/smp/api/mailconfigs",
    "fullPath" => "/smp/api/mailconfigs/{mailconfigId}/templates/{templateId}",
    "functionParams" => array(
        array(
            "parameterName" => "mailTemplate",
            "ajaxCheck" => array("data","apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "object",
            "description" => "mail template; apitesterHint"
        ),
        array(
            "parameterName" => "mailConfigId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "ID of the mail configuration",
            "isUrlParamKey" => true
        ),
        array(
            "parameterName" => "id",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "ID of the mail template",
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'PUT'",
        "apiUrl" => "'mailconfigs/' + mailTemplate.mailConfigId + '/templates/' + mailTemplate.id",
        "data" => "mailTemplate"
    )
));

?>