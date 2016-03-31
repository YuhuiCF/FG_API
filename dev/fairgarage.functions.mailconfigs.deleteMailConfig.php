<?php
        
$FgApiLibrary -> addFunction(array(
    "functionName" => "deleteMailConfig",
    "description" => "delete mail configuration",
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
        "type" => "'DELETE'",
        "apiUrl" => "'mailconfigs/' + mailConfigId"
        // ajaxcomplete();, ajaxsuccess();, ajaxerror();
    )
));

?>