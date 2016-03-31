<?php
        
$FgApiLibrary -> addFunction(array(
    "functionName" => "deleteMailTemplate",
    "description" => "delete mail template",
    "basePath" => "/smp/api/mailconfigs",
    "fullPath" => "/smp/api/mailconfigs/{mailconfigId}/templates/{templateId}",
    "functionParams" => array(
        array(
            "parameterName" => "mailConfigId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "ID of the mail configuration"
        ),
        array(
            "parameterName" => "templateId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "ID of the mail template"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'DELETE'",
        "apiUrl" => "'mailconfigs/' + mailConfigId + '/templates/' + templateId"
    )
));

?>