
(function($){
    
    var console = window.console || {};
    console.error = window.console.error || function(){};

    window.fg = function(fgObj){
        var self = {};
        var varPrivate = {};
        
        self.properties = {
            ssl: '',
            env: 'api',
            apiBase: '.fairgarage.de/smp/api/'//,
            //languageCode: 'de'
        };
        
        /** 
          * @desc set properties in self.properties
          * @param object newProperties - object with new properties to be added/modified
              * @param string ssl - 'http' (default) or 'https'
              * @param string env - environment of FairGarage API, default value is 'api'
              * @param string apiBase - base URL of FairGarage API, default value is '.fairgarage.de/smp/api/'
              * @param string contextKey - context key used in FairGarage API
              * @param function error - default error function to be used in FairGarage API
        */
        self.setProperties = function(newProperties){
            $.extend(self.properties,newProperties);
        }
        self.setProperties(fgObj);
        
        /** 
          * @desc remove properties in self.properties
          * @param array of strings properties - array with names of properties to be added/modified in self.properties
        */
        self.removeProperties = function(properties){
            $.each(properties,function(){
                delete self.properties[this.toString()];
            });
        }
        
        /** 
          * @desc ajax request
          * @param object obj - obj for jQuery ajax() function,
                                    except modifications in "url", "error", 
                                    and new added: "forceNoSession"
        */
        self.api = function(obj){
            var functionName = obj.functionName || 'api()';
            var type = obj.type || 'GET';
            var urlParam = obj.urlParam || {};
            var url = ((self.properties.ssl == 'https' || self.properties.ssl == 'http') ? self.properties.ssl : 'http') + '://' + self.properties.env + self.properties.apiBase + (obj.url || 'authentication/login') + (varPrivate.sessionId ? ';jsessionid=' + varPrivate.sessionId : '') + ('?' + $.param($.extend({contextKey:self.properties.contextKey},urlParam)));
            var forceNoSession = obj.forceNoSession ? true : false;
            //url = forceNoSession ? url : appendSession(url);
            var error = obj.error;
            
            var ajaxObj = {
                type: type,
                async: obj.async || true,
                cache: obj.cache || false,
                url: url,
                contentType: obj.contentType || 'application/json;charset=UTF-8',
                dataType: obj.dataType || 'json',
                data: obj.data || '',
                error: typeof error == 'function' ? function(jqXHR,textStatus,errorThrown){error(jqXHR,textStatus,errorThrown);} : (typeof self.properties.error == 'function' ? self.properties.error : function(jqXHR,textStatus,errorThrown){
                    try {
                        self.error('Network Error: ' + jqXHR.textStatus + ', ' + jqXHR.responseJSON[0].errorMessage);
                    } catch (err) {
                        self.error('Error in FairGarage API when trying to use function ' + functionName);
                    }
                })
            };
            
            ajaxObj = $.extend(obj,ajaxObj);
            
            $.ajax(ajaxObj);
        };
        
        /** 
          * @desc show error with error message in console
          * @param string str - message string
        */
        self.error = function(str){
            console.error(str);
        }
        
        /** 
          * @desc find FairGarage agreements, API base path: /smp/api/agreements, API full path: /smp/api/agreements
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param (opt) function quickHandle - quickHandle function with parameter (data) of type array of objects. The response can be directly used for the registration.
                    The structure of each object in parameter data:
                        providerId - ID of the providerId (1 for FairGarage)
                        agreementId - ID of the agreement
                        agreementVersionId - version ID of the agreement
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findAgreement = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var obj = {
                url: 'agreements',
                urlParam: $.extend({isPublik:true,context:self.properties.contextKey},criteria),
                success: function(data){
                    if (typeof quickHandle == 'function') {
                        var newData = [];
                        $.each(data,function(){
                            newData.push({
                                providerId: this.providerId,
                                agreementId: this.agreementId,
                                agreementVersionId: this.id
                            });
                        });
                        quickHandle(newData);
                    }
                    if (typeof success == 'function') {
                        success(data);
                    }
                },
                functionName: 'findAgreement()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc check login status, API base path: /smp/api/authentication/login, API full path: /smp/api/authentication/login
          * @param object pobj
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.checkLoginStatus = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var success = ajax.success;
            var error = ajax.error;
            var obj = {
                success: function(data){
                    if (data.sessionId) {
                        varPrivate.sessionId = data.sessionId;
                    } else {
                        delete varPrivate.sessionId;
                    }
                    if (typeof success == 'function') {
                        success(data);
                    }
                },
                error: function(jqXHR,textStatus,errorThrown){
                    delete varPrivate.sessionId;
                    if (typeof error == 'function') {
                        error(jqXHR,textStatus,errorThrown);
                    }
                },
                functionName: 'checkLoginStatus()'
            };
            delete ajax.success;
            delete ajax.error;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc login, API base path: /smp/api/authentication/login, API full path: /smp/api/authentication/login
          * @param object pobj
              * @param object loginData - data of login; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param string username - username
                  * @param string password - password
                  * @param (opt) array of objects agreementVersions - agreement versions
                        an agreement version is in the form {agreementId: 'agreementId'}
              * @param function(data) newAgreements - to display the new agreements whenever there is an update of them, with parameter (data) of type object.
                    The structure of parameter data:
                        addedAgreements - array of objects, agreements to be added
                            agreementId - string, ID of the corresponding agreement
                            title - string, title of the corresponding agreement
                            htmlText - string, html text of the corresponding agreement
                        updatedAgreements - array of objects, agreements to be updated
                            agreementId - string, ID of the corresponding agreement
                            title - string, title of the corresponding agreement
                            htmlText - string, html text of the corresponding agreement
                        loginAgain - function, to login with new agreements
              * @param (opt) function(data) quickHandle - quickHandle function with parameter (data) of type object.
                    The structure of parameter data:
                        authorities - array of strings, authorities of the user
                        emailAddress - string, email address of the user
                        givenname - string, given name of the user
                        middlename - string, middle name of the user
                        surname - string, surname of the user
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.login = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var loginData = pobj.loginData;
            if (typeof loginData == 'undefined') {
                self.error('Please indicate the "loginData" of type object in function login()');
                return;
            }
            if (typeof loginData.username == 'undefined') {
                self.error('Please indicate the "username" of type string in "loginData" in function login()');
                return;
            }
            if (typeof loginData.password == 'undefined') {
                self.error('Please indicate the "password" of type string in "loginData" in function login()');
                return;
            }
            var newAgreements = pobj.newAgreements;
            if (typeof newAgreements == 'undefined') {
                self.error('Please indicate the "newAgreements" of type function(data) in function login()');
                return;
            }
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var complete = ajax.complete;
            varPrivate.loginArguments = arguments[0];
            var obj = {
                data: JSON.stringify(loginData),
                type: 'PUT',
                success: function(data){
                    varPrivate.sessionId = data.user.sessionId;
                    
                    if (typeof quickHandle == 'function') {
                        var newData = {
                            authorities: [],
                            emailAddress: data.user.emailAddress,
                            givenname: data.user.givenname,
                            middlename: data.user.middlename,
                            surname: data.user.surname
                        };
                        $.each(data.user.authorities,function(){
                            newData.authorities.push(this.authority);
                        });
                        quickHandle(newData);
                    }
                    if (typeof success == 'function') {
                        success(data);
                    }
                },
                complete: function(jqXHR,textStatus){
                    var data = jqXHR.responseJSON;
                    if (textStatus == 'error' && (data.agreementVersionsAdded || data.agreementVersionsUpdated)) {// treat new agreements
                        var newData = {
                            addedAgreements: [],
                            updatedAgreements: []
                        };
                        var agreementVersions = [];
                        $.each(data.agreementVersionsAdded,function(){
                            newData.addedAgreements.push({
                                agreementId: this.agreementId,
                                title: this.title,
                                htmlText: this.text,
                            });
                            agreementVersions.push({
                                agreementId: this.agreementId,
                                providerId: this.providerId,
                                agreementVersionId: this.id
                            });
                        });
                        $.each(data.agreementVersionsUpdated,function(){
                            newData.updatedAgreements.push({
                                agreementId: this.agreementId,
                                title: this.title,
                                htmlText: this.text,
                            });
                            agreementVersions.push({
                                agreementId: this.agreementId,
                                providerId: this.providerId,
                                agreementVersionId: this.id
                            });
                        });
                        varPrivate.loginArguments.loginData.agreementVersions = agreementVersions;
                        self.loginAgain = function(){
                            if (varPrivate.loginArguments) {
                                self.login(varPrivate.loginArguments);
                            } else {
                                self.error('Please use the login() function to retry your authentication.')
                            }
                        }
                        newData.loginAgain = function(){
                            self.loginAgain();
                        }
                        
                        newAgreements(newData);
                        return;
                    } else {
                        delete varPrivate.loginArguments;
                    }
                    if (typeof complete == 'function') {
                        complete(jqXHR,textStatus);
                    }
                },
                functionName: 'login()'
            };
            delete ajax.success;
            delete ajax.complete;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc logout, API base path: /smp/api/authentication/logout, API full path: /smp/api/authentication/logout
          * @param object pobj
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.logout = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var error = ajax.error;
            var complete = ajax.complete;
            var obj = {
                type: 'PUT',
                url: 'authentication/logout',
                error: function(jqXHR,textStatus,errorThrown){
                    if (typeof error == 'function') {
                        error(jqXHR,textStatus,errorThrown);
                    }
                },
                complete: function(jqXHR,textStatus){
    	            delete varPrivate.sessionId;
    	            if (typeof complete == 'function') {
                        complete(jqXHR,textStatus);
                    }
                },
                functionName: 'logout()'
            };
            delete ajax.error;
            delete ajax.complete;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc create/post context, API base path: /smp/api/contexts, API full path: /smp/api/contexts
          * @param object pobj
              * @param object context - context config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createContext = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var context = pobj.context;
            if (typeof context == 'undefined') {
                self.error('Please indicate the "context" of type object in function createContext()');
                return;
            }
            var obj = {
                type: 'POST',
                url: 'contexts',
                urlParam: {providerId:context.providerId},
                data: JSON.stringify(context),
                functionName: 'createContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete context, API base path: /smp/api/contexts, API full path: /smp/api/contexts/{key}
          * @param object pobj
              * @param string contextKey - context key
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteContext = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var contextKey = pobj.contextKey;
            if (typeof contextKey == 'undefined') {
                self.error('Please indicate the "contextKey" of type string in function deleteContext()');
                return;
            }
            var obj = {
                url: 'contexts/' + contextKey,
                type: 'DELETE',
                functionName: 'deleteContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find context, API base path: /smp/api/contexts, API full path: /smp/api/contexts
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param (opt) number limit - limit
                  * @param (opt) number locationId - location ID
                  * @param (opt) number offset - offset
                  * @param (opt) number providerId - provider ID
                  * @param (opt) boolean superseded - superseded
                  * @param (opt) string webkitConfigKey - webkit config key
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findContext = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                url: 'contexts',
                urlParam: criteria,
                functionName: 'findContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get context, API base path: /smp/api/contexts, API full path: /smp/api/contexts/{key}
          * @param object pobj
              * @param string contextKey - context key
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getContext = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var contextKey = pobj.contextKey;
            if (typeof contextKey == 'undefined') {
                self.error('Please indicate the "contextKey" of type string in function getContext()');
                return;
            }
            var obj = {
                url: 'contexts/' + contextKey,
                functionName: 'getContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc update/put context, API base path: /smp/api/contexts, API full path: /smp/api/contexts/{key}
          * @param object pobj
              * @param object context - context config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateContext = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var context = pobj.context;
            if (typeof context == 'undefined') {
                self.error('Please indicate the "context" of type object in function updateContext()');
                return;
            }
            var obj = {
                type: 'PUT',
                url: 'contexts/' + context.key,
                data: JSON.stringify(context),
                urlParam: {providerId:context.providerId},
                functionName: 'updateContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find country configuration, API base path: /smp/api/countryconfig, API full path: /smp/api/countryconfig
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param (opt) string countryCode - code of the country
                  * @param (opt) string orderBy - order by
                  * @param (opt) boolean ascending - in ascending order nor not
                  * @param (opt) number offset - offset of the results
                  * @param (opt) number limit - limit of the results
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findCountryConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                url: 'countryconfig',
                urlParam: criteria,
                functionName: 'findCountryConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get country configuration of the current context, API base path: /smp/api/countryconfig/current, API full path: /smp/api/countryconfig/current
          * @param object pobj
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getCurrentCountryConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var obj = {
                url: 'countryconfig/current',
                functionName: 'getCurrentCountryConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc create mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates
          * @param object pobj
              * @param string mailConfigId - ID of the mail configuration
              * @param object mailTemplate - mail template; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createMailTemplate = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                self.error('Please indicate the "mailConfigId" of type string in function createMailTemplate()');
                return;
            }
            var mailTemplate = pobj.mailTemplate;
            if (typeof mailTemplate == 'undefined') {
                self.error('Please indicate the "mailTemplate" of type object in function createMailTemplate()');
                return;
            }
            var obj = {
                type: 'POST',
                url: 'mailconfigs/' + mailConfigId + '/templates',
                data: JSON.stringify(mailTemplate),
                functionName: 'createMailTemplate()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete all mail templates, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates
          * @param object pobj
              * @param string mailConfigId - ID of the mail configuration
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteAllMailTemplates = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                self.error('Please indicate the "mailConfigId" of type string in function deleteAllMailTemplates()');
                return;
            }
            var obj = {
                type: 'DELETE',
                url: 'mailconfigs/' + mailConfigId + '/templates',
                functionName: 'deleteAllMailTemplates()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{id}
          * @param object pobj
              * @param string mailConfigId - ID of the mail configuration
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteMailConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                self.error('Please indicate the "mailConfigId" of type string in function deleteMailConfig()');
                return;
            }
            var obj = {
                type: 'DELETE',
                url: 'mailconfigs/' + mailConfigId,
                functionName: 'deleteMailConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates/{templateId}
          * @param object pobj
              * @param string mailConfigId - ID of the mail configuration
              * @param string templateId - ID of the mail template
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteMailTemplate = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                self.error('Please indicate the "mailConfigId" of type string in function deleteMailTemplate()');
                return;
            }
            var templateId = pobj.templateId;
            if (typeof templateId == 'undefined') {
                self.error('Please indicate the "templateId" of type string in function deleteMailTemplate()');
                return;
            }
            var obj = {
                type: 'DELETE',
                url: 'mailconfigs/' + mailConfigId + '/templates/' + templateId,
                functionName: 'deleteMailTemplate()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param (opt) string name - name of the mail configuration
                  * @param (opt) number providerId - ID of the provider
                  * @param (opt) boolean isPublic - whether the mail configuration is public or not
                  * @param (opt) string languageCode - language code; "de", "en", "pl", or other language codes that can be found by function findCountryConfig()
                  * @param (opt) string countryCode - country code; "DE", "GB", "PL", or other country codes that can be found by function findCountryConfig()
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findMailConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                url: 'mailconfigs',
                urlParam: criteria,
                functionName: 'findMailConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates
          * @param object pobj
              * @param object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param string mailConfigId - ID of the mail configuration
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findMailTemplate = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            if (typeof criteria == 'undefined') {
                self.error('Please indicate the "criteria" of type object in function findMailTemplate()');
                return;
            }
            var obj = {
                url: 'mailconfigs/' + criteria.mailConfigId + '/templates',
                urlParam: criteria,
                functionName: 'findMailTemplate()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{id}
          * @param object pobj
              * @param string mailConfigId - ID of the mail configuration
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getMailConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                self.error('Please indicate the "mailConfigId" of type string in function getMailConfig()');
                return;
            }
            var obj = {
                url: 'mailconfigs/' + mailConfigId,
                functionName: 'getMailConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates/{templateId}
          * @param object pobj
              * @param string mailConfigId - ID of the mail configuration
              * @param string templateId - ID of the mail template
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getMailTemplate = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                self.error('Please indicate the "mailConfigId" of type string in function getMailTemplate()');
                return;
            }
            var templateId = pobj.templateId;
            if (typeof templateId == 'undefined') {
                self.error('Please indicate the "templateId" of type string in function getMailTemplate()');
                return;
            }
            var obj = {
                url: 'mailconfigs/' + mailConfigId + '/templates/' + templateId,
                functionName: 'getMailTemplate()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc update mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{id}
          * @param object pobj
              * @param string mailConfigId - ID of the mail configuration
              * @param object mailConfig - mail configuration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateMailConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                self.error('Please indicate the "mailConfigId" of type string in function updateMailConfig()');
                return;
            }
            var mailConfig = pobj.mailConfig;
            if (typeof mailConfig == 'undefined') {
                self.error('Please indicate the "mailConfig" of type object in function updateMailConfig()');
                return;
            }
            var obj = {
                type: 'PUT',
                url: 'mailconfigs/' + mailConfigId,
                data: JSON.stringify(mailConfig),
                functionName: 'updateMailConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc update mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates/{templateId}
          * @param object pobj
              * @param string mailConfigId - ID of the mail configuration
              * @param string templateId - ID of the mail template
              * @param object mailTemplate - mail template; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateMailTemplate = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                self.error('Please indicate the "mailConfigId" of type string in function updateMailTemplate()');
                return;
            }
            var templateId = pobj.templateId;
            if (typeof templateId == 'undefined') {
                self.error('Please indicate the "templateId" of type string in function updateMailTemplate()');
                return;
            }
            var mailTemplate = pobj.mailTemplate;
            if (typeof mailTemplate == 'undefined') {
                self.error('Please indicate the "mailTemplate" of type object in function updateMailTemplate()');
                return;
            }
            var obj = {
                type: 'PUT',
                url: 'mailconfigs/' + mailConfigId + '/templates/' + templateId,
                data: JSON.stringify(mailTemplate),
                functionName: 'updateMailTemplate()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find part quality, API base path: /smp/api/partqualities, API full path: /smp/api/partqualities
          * @param object pobj
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findPartQuality = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var obj = {
                url: 'partqualities',
                functionName: 'findPartQuality()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find region, API base path: /smp/api/regions, API full path: /smp/api/regions
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param (opt) string searchTerm - search term
              * @param (opt) function(data) quickHandle - quickHandle function with parameter (data) of type array of objects.
                    The structure of each object in parameter data:
                        formattedName - string, formatted name of the region
                        nearbyLocationCount - number, number of nearby locations
                        signature - string, region signature
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findRegion = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var obj = {
                url: 'regions',
                urlParam: criteria,
                success: function(data){
                    if (typeof quickHandle == 'function') {
                        var newData = [];
                        $.each(data,function(){
                            newData.push({
                                formattedName: this.formattedName,
                                nearbyLocationCount: this.nearbyLocationCount,
                                signature: this.signature
                            });
                        });
                        quickHandle(newData);
                    }
                    if (typeof success == 'function') {
                        success(data);
                    }
                },
                functionName: 'findRegion()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get region by region signature, API base path: /smp/api/regions/signature, API full path: /smp/api/regions/signature/{signature}
          * @param object pobj
              * @param string signature - region signature
              * @param (opt) function(data) quickHandle - quickHandle function with parameter (data) of type object.
                    The structure of the parameter data:
                        formattedName - string, formatted name of the region
                        nearbyLocationCount - number, number of nearby locations
                        signature - string, region signature
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getRegionBySignature = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var signature = pobj.signature;
            if (typeof signature == 'undefined') {
                self.error('Please indicate the "signature" of type string in function getRegionBySignature()');
                return;
            }
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var obj = {
                url: 'regions/signature/' + signature,
                success: function(data){
                    if (typeof quickHandle == 'function') {
                        newData = {
                            formattedName: data.formattedName,
                            nearbyLocationCount: data.nearbyLocationCount,
                            signature: data.signature
                        };
                        quickHandle(newData);
                    }
                    if (typeof success == 'function') {
                        success(data);
                    }
                },
                functionName: 'getRegionBySignature()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get region of the user, API base path: /smp/api/regions/default, API full path: /smp/api/regions/default
          * @param object pobj
              * @param (opt) function(data) quickHandle - quickHandle function with parameter (data) of type object.
                    The structure of the parameter data:
                        formattedName - string, formatted name of the region
                        nearbyLocationCount - number, number of nearby locations
                        signature - string, region signature
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getRegionOfUser = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var obj = {
                url: 'regions/default',
                success: function(data){
                    if (typeof quickHandle == 'function') {
                        newData = {
                            formattedName: data.formattedName,
                            nearbyLocationCount: data.nearbyLocationCount,
                            signature: data.signature
                        };
                        quickHandle(newData);
                    }
                    if (typeof success == 'function') {
                        success(data);
                    }
                },
                functionName: 'getRegionOfUser()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find service, API base path: /smp/api/services/services, API full path: /smp/api/services/services
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param (opt) string searchTerm - search term, name of the service
                  * @param (opt) string vehicleTypeId - ID of the vehicle type
                  * @param (opt) string constructionTime - construction time of the vehicle, in the format "YYYY-MM-01"
                  * @param (opt) number numResults - number of results
              * @param (opt) function quickHandle - quickHandle function with parameter (data) of type array of objects
                    The structure of each object in parameter data:
                        serviceId - number, ID of the service
                        serviceName - string, name of the service
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findService = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var obj = {
                url: 'services/services',
                urlParam: criteria,
                success: function(data){
                    if (typeof quickHandle != 'undefined') {
                        var newData = [];
                        $.each(data,function(){
                            newData.push({
                                serviceId: this.id,
                                serviceName: this.name
                            });
                        });
                        quickHandle(newData);
                    }
                    if (typeof success == 'function') {
                        success(data);
                    }
                },
                functionName: 'findService()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc register as individual FairGarage user. If this step is successful, the user will receive an email concerning setting the password, to complete the registration, API base path: /smp/api/users, API full path: /smp/api/users
          * @param object pobj
              * @param string registrationData - data of registration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param string salutation - salutation
                  * @param string givenname - given name
                  * @param string surname - surname
                  * @param string emailAddress - email address
                  * @param array of objects, the agreement objects can be obtained by findAgreement acceptedAgreements - accepted agreements
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.registerUser = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var registrationData = pobj.registrationData;
            if (typeof registrationData == 'undefined') {
                self.error('Please indicate the "registrationData" of type string in function registerUser()');
                return;
            }
            if (typeof registrationData.salutation == 'undefined') {
                self.error('Please indicate the "salutation" of type string in "registrationData" in function registerUser()');
                return;
            }
            if (typeof registrationData.givenname == 'undefined') {
                self.error('Please indicate the "givenname" of type string in "registrationData" in function registerUser()');
                return;
            }
            if (typeof registrationData.surname == 'undefined') {
                self.error('Please indicate the "surname" of type string in "registrationData" in function registerUser()');
                return;
            }
            if (typeof registrationData.emailAddress == 'undefined') {
                self.error('Please indicate the "emailAddress" of type string in "registrationData" in function registerUser()');
                return;
            }
            if (typeof registrationData.acceptedAgreements == 'undefined') {
                self.error('Please indicate the "acceptedAgreements" of type array of objects, the agreement objects can be obtained by findAgreement in "registrationData" in function registerUser()');
                return;
            }
            var obj = {
                url: 'users',
                type: 'POST',
                data: JSON.stringify(registrationData),
                functionName: 'registerUser()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find vehicle by catalog, API base path: /smp/api/vehicles/catalog, API full path: /smp/api/vehicles/catalog/{vehicleCategoryId}
          * @param object pobj
              * @param string categoryId - vehicle category ID. To find IDs of the next category, start with "62303" for SUV/passenger cars, or "83503" for transporters
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param (opt) string constructionTime - construction time of the vehicle, in the format "YYYY-MM-01"
              * @param (opt) function(data) quickHandle - quickHandle function with parameter (data) of type array of objects.
                    The structure of each object in the parameter data:
                        lastLevel - boolean, if the last category level is reached
                        id - number, ID of the category; or ID of the vehicle type (if the vehicle is found)
                        name - string, name of the category
                        externalId - string, external ID or Ecode of the vehicle (if the vehicle is found)
                        properties - array of objects of the vehicle (if the vehicle is found)
                            The structure of each property object:
                                name - string, name of the property
                                value - string, value of the property
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleByCatalog = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var categoryId = pobj.categoryId;
            if (typeof categoryId == 'undefined') {
                self.error('Please indicate the "categoryId" of type string in function findVehicleByCatalog()');
                return;
            }
            var criteria = pobj.criteria;
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var obj = {
                url: 'vehicles/catalog/' + categoryId,
                urlParam: criteria,
                success: function(data){
                    if (typeof quickHandle == 'function') {
                        var newData = [];
                        var key;
                        if (data.categories.length > 0) {
                            key = 'categories';
                        }
                        if (data.types.length > 0) {
                            key = 'types';
                        }
                        $.each(data[key],function(){
                            newData.push({
                                lastLevel: key == 'types',
                                id: this.id,
                                name: this.name,
                                externalId: (key == 'types' ? this.externalId : null),
                                properties: []
                            });
                            $.each(this.properties,function(){
                                newData[newData.length - 1].properties.push({
                                    name: this.type.name,
                                    value: this.value
                                });
                            });
                        });
                        quickHandle(newData);
                    }
                    if (typeof success == 'function') {
                        success(data);
                    }
                },
                functionName: 'findVehicleByCatalog()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find vehicle by the external ID of the vehicle, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param (opt) string externalId - external ID or Ecode of the vehicle
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleByExternalId = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                url: 'vehicles/vehicletypes',
                urlParam: criteria,
                functionName: 'findVehicleByExternalId()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find vehicle by HSN/TSN of the vehicle, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param (opt) string hsn - HSN of the vehicle
                  * @param (opt) string tsn - TSN of the vehicle
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleByHSNTSN = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                url: 'vehicles/vehicletypes',
                urlParam: criteria,
                functionName: 'findVehicleByHSNTSN()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find vehicle equipment, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes/{id}/equipments
          * @param object pobj
              * @param string vehicleTypeId - ID of the vehicle type
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleEquipment = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var vehicleTypeId = pobj.vehicleTypeId;
            if (typeof vehicleTypeId == 'undefined') {
                self.error('Please indicate the "vehicleTypeId" of type string in function findVehicleEquipment()');
                return;
            }
            var obj = {
                url: 'vehicles/vehicletypes/' + vehicleTypeId + '/equipments',
                functionName: 'findVehicleEquipment()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find vehicle equipment for selected service, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes/{id}/equipments/{serviceId}/{constructionTime}
          * @param object pobj
              * @param string vehicleTypeId - ID of the vehicle type
              * @param string serviceId - ID of the service
              * @param string constructionTime - construction time of the vehicle, in the format "YYYY-MM-01"
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleEquipmentForService = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var vehicleTypeId = pobj.vehicleTypeId;
            if (typeof vehicleTypeId == 'undefined') {
                self.error('Please indicate the "vehicleTypeId" of type string in function findVehicleEquipmentForService()');
                return;
            }
            var serviceId = pobj.serviceId;
            if (typeof serviceId == 'undefined') {
                self.error('Please indicate the "serviceId" of type string in function findVehicleEquipmentForService()');
                return;
            }
            var constructionTime = pobj.constructionTime;
            if (typeof constructionTime == 'undefined') {
                self.error('Please indicate the "constructionTime" of type string in function findVehicleEquipmentForService()');
                return;
            }
            var obj = {
                url: 'vehicles/vehicletypes/' + vehicleTypeId + '/equipments/' + serviceId + '/' + constructionTime,
                functionName: 'findVehicleEquipmentForService()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get vehicle by VIN, API base path: /smp/api/vehicles/vehicles, API full path: /smp/api/vehicles/vehicles/{vin}
          * @param object pobj
              * @param string vin - VIN of the vehicle
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getVehicleByVIN = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var vin = pobj.vin;
            if (typeof vin == 'undefined') {
                self.error('Please indicate the "vin" of type string in function getVehicleByVIN()');
                return;
            }
            var obj = {
                url: 'vehicles/vehicles/' + vin,
                functionName: 'getVehicleByVIN()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get vehicle by vehicle type ID, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes/{id}
          * @param object pobj
              * @param string vehicleTypeId - ID of the vehicle type
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getVehicleByVehicleTypeId = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var vehicleTypeId = pobj.vehicleTypeId;
            if (typeof vehicleTypeId == 'undefined') {
                self.error('Please indicate the "vehicleTypeId" of type string in function getVehicleByVehicleTypeId()');
                return;
            }
            var obj = {
                url: 'vehicles/vehicletypes/' + vehicleTypeId,
                functionName: 'getVehicleByVehicleTypeId()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc create webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs
          * @param object pobj
              * @param object webkitConfig - webkit config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createWebkitConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var webkitConfig = pobj.webkitConfig;
            if (typeof webkitConfig == 'undefined') {
                self.error('Please indicate the "webkitConfig" of type object in function createWebkitConfig()');
                return;
            }
            var obj = {
                url: 'webkit/webkitconfigs',
                data: JSON.stringify(webkitConfig),
                functionName: 'createWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs/{key}
          * @param object pobj
              * @param string webkitConfigKey - webkit config key
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteWebkitConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var webkitConfigKey = pobj.webkitConfigKey;
            if (typeof webkitConfigKey == 'undefined') {
                self.error('Please indicate the "webkitConfigKey" of type string in function deleteWebkitConfig()');
                return;
            }
            var obj = {
                url: 'webkit/webkitconfigs/' + webkitConfigKey,
                type: 'DELETE',
                functionName: 'deleteWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param (opt) number limit - limit
                  * @param (opt) number offset - offset
                  * @param (opt) number providerId - provider ID
                  * @param (opt) boolean superseded - superseded
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findWebkitConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                url: 'webkit/webkitconfigs',
                urlParam: criteria,
                functionName: 'findWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs/{key}
          * @param object pobj
              * @param string webkitConfigKey - webkit config key
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getWebkitConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var webkitConfigKey = pobj.webkitConfigKey;
            if (typeof webkitConfigKey == 'undefined') {
                self.error('Please indicate the "webkitConfigKey" of type string in function getWebkitConfig()');
                return;
            }
            var obj = {
                url: 'webkit/webkitconfigs/' + webkitConfigKey,
                functionName: 'getWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc update/put webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs/{key}
          * @param object pobj
              * @param object webkitConfig - webkit config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateWebkitConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var webkitConfig = pobj.webkitConfig;
            if (typeof webkitConfig == 'undefined') {
                self.error('Please indicate the "webkitConfig" of type object in function updateWebkitConfig()');
                return;
            }
            var obj = {
                url: 'webkit/webkitconfigs/' + webkitConfig.key,
                type: 'PUT',
                data: JSON.stringify(webkitConfig),
                functionName: 'updateWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        return self;
    }
    
})(jQuery);