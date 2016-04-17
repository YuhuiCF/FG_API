<?php

$FgApiLibrary -> addFunction(array(
    "functionName" => "webUserLogin",
    "description" => "login for web customer",
    "basePath" => "/smp/api/authentication/login/webuser",
    "fullPath" => "/smp/api/authentication/login/webuser",
    "storeArgumentsAs" => "loginArguments",
    "functionParams" => array(
        array(
            "parameterName" => "newAgreements",
            "ajaxCheck" => "complete",
            "type" => "function(data)",
            "description" => "to display the new agreements whenever there is an update of them, with parameter (data) of type object.
                    The structure of parameter data:
                        addedAgreements - array of objects, agreements to be added
                            agreementId - string, ID of the corresponding agreement
                            title - string, title of the corresponding agreement
                            htmlText - string, html text of the corresponding agreement
                        updatedAgreements - array of objects, agreements to be updated
                            agreementId - string, ID of the corresponding agreement
                            title - string, title of the corresponding agreement
                            htmlText - string, html text of the corresponding agreement
                        loginAgain - function, to login with new agreements",
            "isMandatory" => true
        ),
        array(
            "parameterName" => "loginData",
            "ajaxCheck" => "data",
            "type" => "object",
            "description" => "data of login; apitesterHint",
            "isMandatory" => true
        ),
        array(
            "parameterName" => "username",
            "type" => "string",
            "description" => "username",
            "isMandatory" => true,
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "password",
            "type" => "string",
            "description" => "password",
            "isMandatory" => true,
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => "agreementVersions",
            "type" => "array of objects",
            "description" => "agreement versions
                        an agreement version is in the form {agreementId: 'agreementId'}",
            "isAjaxDataKey" => true
        ),
        array(
            "parameterName" => $FgApiLibrary -> functionQuickHandle,
            "ajaxCheck" => "success",
            "type" => "function(data)",
            "description" => $FgApiLibrary -> functionQuickHandle." function with parameter (data) of type object.
                    The structure of parameter data:
                        authorities - array of strings, authorities of the user
                        emailAddress - string, email address of the user
                        givenname - string, given name of the user
                        middlename - string, middle name of the user
                        surname - string, surname of the user"
        )
    ),
    "ajaxDefaultParams" => array(
        "type" => "'POST'",
        "apiUrl" => "'authentication/login/webuser'",
        "data" => "loginData",
        "success" => "function(data){
                    ".$FgApiLibrary -> varPrivate.".".$FgApiLibrary -> sessionId." = data.sessionId;

                    if (isType(".$FgApiLibrary -> functionQuickHandle.",'function')) {
                        var newData = {
                            authorities: [],
                            emailAddress: data.user.emailAddress,
                            givenname: data.user.givenname,
                            middlename: data.user.middlename,
                            surname: data.user.surname
                        };
                        _.each(data.user.authorities,function(authority){
                            newData.authorities.push(authority.authority);
                        });
                        ".$FgApiLibrary -> functionQuickHandle."(newData);
                    }
                    ajaxsuccess();
                }",
        "complete" => "function(jqXHR,textStatus){
                    var data = jqXHR.responseJSON;
                    if (textStatus === 'error' && data.all) {// treat new agreements
                        var newData = {
                            addedAgreements: [],
                            updatedAgreements: []
                        };
                        var agreementVersions = [];
                        _.each(data.agreementVersionsAdded,function(agreement){
                            newData.addedAgreements.push({
                                agreementId: agreement.agreementId,
                                title: agreement.title,
                                htmlText: agreement.text
                            });
                            agreementVersions.push({
                                agreementId: agreement.agreementId,
                                locationId: agreement.locationId,
                                id: agreement.id
                            });
                        });
                        _.each(data.agreementVersionsUpdated,function(agreement){
                            newData.updatedAgreements.push({
                                agreementId: agreement.agreementId,
                                title: agreement.title,
                                htmlText: agreement.text
                            });
                            agreementVersions.push({
                                agreementId: agreement.agreementId,
                                locationId: agreement.locationId,
                                id: agreement.id
                            });
                        });
                        ".$FgApiLibrary -> varPrivate.".loginArguments.loginData.agreementVersions = agreementVersions;
                        ".$FgApiLibrary -> outputObj.".loginAgain = function(){
                            if (".$FgApiLibrary -> varPrivate.".loginArguments) {
                                ".$FgApiLibrary -> outputObj.".login(".$FgApiLibrary -> varPrivate.".loginArguments);
                            } else {
                                ".$FgApiLibrary -> outputObj.".error('Please use the login() function to retry your authentication.');
                            }
                        };
                        newData.loginAgain = function(){
                            ".$FgApiLibrary -> outputObj.".loginAgain();
                        };

                        newAgreements(newData);
                        return;
                    } else {
                        delete ".$FgApiLibrary -> varPrivate.".loginArguments;
                    }
                    ajaxcomplete();
                }"
    )
));

?>
