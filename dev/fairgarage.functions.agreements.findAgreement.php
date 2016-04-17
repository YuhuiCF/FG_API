<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => $FgApiLibrary -> functionFindAgreement,
    "description" => "find FairGarage agreements",
    "basePath" => "/smp/api/agreements",
    "fullPath" => "/smp/api/agreements",
	"functionParams" => array(
        array(
            "parameterName" => "criteria",
            "ajaxCheck" => "urlParam",
            "type" => "object",
            "description" => "search criteria; apitesterHint"
        ),
        array(
            "parameterName" => $FgApiLibrary -> functionQuickHandle,
            "ajaxCheck" => "success",
            "type" => "function(data)",
            "description" => $FgApiLibrary -> functionQuickHandle." function with parameter (data) of type array of objects. The response can be directly used for the registration.
                    The structure of each object in parameter data:
                        locationId - locationIdHint
                        agreementId - agreementIdHint
                        context - contextHint"
        )
	),
    "ajaxDefaultParams" => array(
        "type" => "'GET'",
        "apiUrl" => "'agreements'",
        "urlParam" => "extend({context:".$FgApiLibrary -> outputObj.".".$FgApiLibrary -> functionGetProperty."('contextKey')},criteria)",//isPublik:true,
        "success" => "function(data){
                    if (isType(quickHandle,'function')) {
                        var newData = [];
                        _.each(data,function(agreement){
                            newData.push({
                                agreementId: agreement.agreementId,
                                agreementVersionId: agreement.id
                            });
                        });
                        quickHandle(newData);
                    }
                    ajaxsuccess();
                }"
    )
));

?>
