<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findMailTemplate",
    "description" => "find mail template",
    "basePath" => "/smp/api/mailconfigs",
    "fullPath" => "/smp/api/mailconfigs/{mailconfigId}/templates",
    "functionParams" => array(
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => array("urlParam","apiUrl"),
            "type" => "object",
            "description" => "search criteria; apitesterHint",
            "isMandatory" => true
        ),
        array(
            "parameterName" => "mailConfigId",
            "ajaxCheck" => "apiUrl",
            "description" => "ID of the mail configuration",
            "type" => "string",
            "isMandatory" => true,
            "isUrlParamKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'mailconfigs/' + criteria.mailConfigId + '/templates'",
        "urlParam" => "criteria"
        // ajaxcomplete(), ajaxsuccess(), ajaxerror()
    )
));

?>