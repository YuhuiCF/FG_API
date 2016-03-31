<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "createMailConfig",
    "description" => "create mail configuration",
    "basePath" => "/smp/api/mailconfigs",
    "fullPath" => "/smp/api/mailconfigs",
    "functionParams" => array(
        array(
            "parameterName" => "mailConfig",
            "ajaxCheck" => array("data"),
            "isMandatory" => true,
            "type" => "object",
            "description" => "mail configuration; apitesterHint"
        ),
        array(
            "parameterName" => "countryCode",
            "isAjaxDataKey" => true,
            "semiMandatoryDefaultValue" => $FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionGetProperty."('countryCode')",
            "type" => "string",
            "description" => "countryCodeHint"
        ),
        array(
            "parameterName" => "languageCode",
            "isAjaxDataKey" => true,
            "semiMandatoryDefaultValue" => $FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionGetProperty."('languageCode')",
            "type" => "string",
            "description" => "languageCodeHint"
        ),
        array(
            "parameterName" => "name",
            "isAjaxDataKey" => true,
            "isMandatory" => true,
            "type" => "string",
            "description" => "name of the mail configuration"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'mailconfigs'",
        "data" => "mailConfig"
        // ajaxcomplete();, ajaxsuccess();, ajaxerror(); outputObj, functionParamObj, ajaxParamName, functionSetProperties, functionGetProperty, functionRemoveProperty, functionQuickHandle
    )
));

?>