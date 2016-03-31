<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getCurrentCountryConfig",
    "description" => "get country configuration of the current context",
    "basePath" => "/smp/api/countryconfig/current",
    "fullPath" => "/smp/api/countryconfig/current",
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'countryconfig/current'"
    )
));

?>