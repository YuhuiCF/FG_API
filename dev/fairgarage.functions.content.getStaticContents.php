<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getStaticContents",
    "description" => "get all static contents for category",
    "basePath" => "/smp/api/content",
    "fullPath" => "/smp/api/content/{key}/children",
    "functionParams" => array(
        array(
            "parameterName" => "category",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "category (path) of static content"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'content/' + category + '/children'"
    )
));

?>