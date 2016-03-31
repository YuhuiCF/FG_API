<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "registerUser",
    "description" => "register as individual FairGarage user. If this step is successful, the user will receive an email concerning setting the password, to complete the registration",
    "basePath" => "/smp/api/users",
    "fullPath" => "/smp/api/users",
    "functionParams" => array(
        array(
            "parameterName" => "registrationData",
            "ajaxCheck" => "data",
            "isMandatory" => true,
            "type" => "object",
            "description" => "data of registration; apitesterHint"
        ),
        array(
            "parameterName" => "salutation",
            "isMandatory" => true,
            "type" => "string",
            "description" => "salutation, accepted values are 'm' (for male) and 'f' (for female)",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "givenname",
            "isMandatory" => true,
            "type" => "string",
            "description" => "given name",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "surname",
            "isMandatory" => true,
            "type" => "string",
            "description" => "surname",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "username",
            "isMandatory" => true,
            "type" => "string",
            "description" => "username, or email address",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "locationId",
            "isMandatory" => true,
            "type" => "string",
            "description" => "the user will be registered to this location",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "acceptedAgreements",
            "isMandatory" => true,
            "type" => "array of objects, the agreement objects can be obtained by ".$FgApiLibrary -> functionFindAgreement,
            "description" => "accepted agreements",
            "isAjaxDataKey" => true
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'users'",
        "data" => "registrationData"
        // ajaxcomplete(), ajaxsuccess(), ajaxerror()
    )
));

?>
