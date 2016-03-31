<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "findContext",
    "description" => "find context",
    "basePath" => "/smp/api/authentication/login",// FG API path info
    "fullPath" => "/smp/api/authentication/login",// FG API path info
    "storeArgumentsAs" => "loginArguments",// store the arguments of this function, such that it might be reused, e.g. in login()
    "functionParams" => array(
        array(
            "parameterName" => "findContextData",
            "ajaxCheck" => array("data"),// or "data" if only one value. This field is used to remind you that this parameter should be used in which key of the ajax key in the function parameter
            "isMandatory" => false,
            "semiMandatoryDefaultValue" => "semiMandatoryDefaultValue",// "isMandatory" is then automatically set as true. The parameter is mandatory, if the default value or default expression does not exist
            "type" => "object",
            "description" => "filters; apitesterHint; constructionTimeHint; countryCodeHint; languageCodeHint, semiMandatoryValueHint; vehicleTypeIdHint; "// the ***Hint are variables in the FgApiLibrary object, such that these descriptions could be "shared"
        ),
        array(
            "parameterName" => "aKeyOfAjaxData",
            "description" => "search criteria",
            "isMandatory" => false,
            "type" => "string",
            "isAjaxDataKey" => true,// this is a key in ajax.data
            "isUrlParamKey" => false// this is not a key in ajax.urlParam
            // here are some object fields that are required to use in constructing the FG library
            // outputObj, functionParamObj, ajaxParamName, functionSetProperties, functionGetProperty, functionRemoveProperty, functionQuickHandle
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'contexts/' + contextKey",
        "urlParam" => "{name:value}",// singleLine-value, for GET
        "data" => "findContextData"// singleLine-value, for PUT and POST, will be automatically stringified
        // these expressions are some short-hand keywords to replace the client-defined complete(), success(), and error()
        // ajaxcomplete();, ajaxsuccess();, ajaxerror();
    )
));

?>