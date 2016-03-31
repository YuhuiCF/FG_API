<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getGuildmembership",
    "description" => "get guild membership",
    "basePath" => "/smp/api/locations/guildmembership",
    "fullPath" => "/smp/api/locations/guildmembership/{id}",
    "functionParams" => array(
        array(
            "parameterName" => "guildmembershipId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "type" => "string or number",
            "isMandatory" => true,
            "description" => "ID of the guildmembership",
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'locations/guildmembership/' + guildmembershipId"
        // ajaxcomplete();, ajaxsuccess();, ajaxerror();
    )
));

?>