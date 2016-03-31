<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "getServiceCategory",
    "description" => "get service category",
    "basePath" => "/smp/api/services/servicecategories",
    "fullPath" => "/smp/api/services/servicecategories/{serviceCategoryId}",
    "functionParams" => array(
        array(
            "parameterName" => "serviceCategoryId",
            "ajaxCheck" => array("apiUrl"),// or "data" if only one value
            "isMandatory" => true,
            "type" => "string",
            "description" => "ID of service category"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'services/servicecategories/' + serviceCategoryId"
    )
));

?>