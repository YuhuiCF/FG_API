<?php
        
$FgApiLibrary -> addFunction(array(
    "functionName" => "deleteAllMailTemplates",
    "description" => "delete all mail templates",
    "basePath" => "/smp/api/mailconfigs",
    "fullPath" => "/smp/api/mailconfigs/{mailconfigId}/templates",
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
        "type" => "'DELETE'",
        "apiUrl" => "'mailconfigs/' + mailConfigId + '/templates'"
    )
));

?>