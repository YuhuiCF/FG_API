
(function($){
    
    var console = window.console || {};
    console.error = window.console.error || function(){};

    window.fg = function(fgObj){
        var self = {};
        var varPrivate = {};
        
        self.properties = {
            ssl: 'http',
            env: 'api',
            apiBase: '.fairgarage.de/smp/api/'//,
            //languageCode: 'de'
        };
        
        /** 
          * @desc set properties in self.properties
          * @param {object} newProperties - object with new properties to be added/modified
              * @param {string} ssl - 'http' (default) or 'https'
              * @param {string} env - environment of FairGarage API, default value is 'api'
              * @param {string} apiBase - base URL of FairGarage API, default value is '.fairgarage.de/smp/api/'
              * @param {string} contextKey - context key used in FairGarage API
              * @param {function} error - default error function to be used in FairGarage API
        */
        self.setProperties = function(newProperties){
            $.extend(self.properties,newProperties);
        }
        self.setProperties(fgObj);
        
        /** 
          * @desc get property in self.properties
          * @param {string} propertyName - object with new properties to be added/modified
          * @return the value of the property, otherwise null, if propertyName not defined
        */
        self.getProperty = function(propertyName){
            return self.properties[propertyName];
        }
        
        /** 
          * @desc remove properties in self.properties
          * @param {array of strings} properties - array with names of properties to be added/modified in self.properties
        */
        self.removeProperties = function(properties){
            $.each(properties,function(){
                delete self.properties[this.toString()];
            });
        }
        
        /** 
          * @desc ajax request
          * @param {object} obj - obj for jQuery ajax() function,
                                    except modifications in "url", "error", 
                                    and new added: "forceNoSession"
        */
        self.api = function(obj){
            var functionName = obj.functionName || 'api()';
            var type = obj.type || 'GET';
            var urlParam = obj.urlParam || {};
            var url = ((['http','https'].indexOf(self.getProperty('ssl')) >= 0) ? self.getProperty('ssl') : 'http') + '://' + self.getProperty('env') + self.getProperty('apiBase') + (obj.url || 'authentication/login') + (varPrivate.sessionId ? ';jsessionid=' + varPrivate.sessionId : '') + ('?' + $.param($.extend({contextKey:self.getProperty('contextKey')},urlParam)));
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
                error: typeof error == 'function' ? function(jqXHR,textStatus,errorThrown){error(jqXHR,textStatus,errorThrown);} : (typeof self.getProperty('error') == 'function' ? self.getProperty('error') : function(jqXHR,textStatus,errorThrown){
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
          * @param {string} str - message string
        */
        self.error = function(str){
            console.error(str);
        }
        
        /** 
          * @desc find FairGarage agreements, API base path: /smp/api/agreements, API full path: /smp/api/agreements
          * @param {object} pobj
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param {function} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects. The response can be directly used for the registration.
                    The structure of each object in parameter data:
                        providerId - ID of the providerId (1 for FairGarage)
                        agreementId - ID of the agreement
                        agreementVersionId - version ID of the agreement
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                urlParam: $.extend({isPublik:true,context:self.getProperty('contextKey')},criteria),
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
          * @param {object} pobj
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
          * @param {object} pobj
              * @param {function(data)} newAgreements - to display the new agreements whenever there is an update of them, with parameter (data) of type object.
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
              * @param {object} loginData - data of login; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} username - username
                  * @param {string} password - password
                  * @param {array of objects} agreementVersions (opt) - agreement versions
                        an agreement version is in the form {agreementId: 'agreementId'}
              * @param {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type object.
                    The structure of parameter data:
                        authorities - array of strings, authorities of the user
                        emailAddress - string, email address of the user
                        givenname - string, given name of the user
                        middlename - string, middle name of the user
                        surname - string, surname of the user
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.login = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var newAgreements = pobj.newAgreements;
            if (typeof newAgreements == 'undefined') {
                paramMissingHint.push('"newAgreements" of type "function(data)"');
            }
            var loginData = pobj.loginData;
            if (typeof loginData == 'undefined') {
                paramMissingHint.push('"loginData" of type "object"');
            }
            if (typeof loginData == 'undefined' || typeof loginData.username == 'undefined') {
                paramMissingHint.push('"username" of type "string" in "loginData"');
            }
            if (typeof loginData == 'undefined' || typeof loginData.password == 'undefined') {
                paramMissingHint.push('"password" of type "string" in "loginData"');
            }
            var quickHandle = pobj.quickHandle;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function login(): ' + paramMissingHint.join(', '));
                return;
            }
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
                                htmlText: this.text
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
                                htmlText: this.text
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
          * @param {object} pobj
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
          * @param {object} pobj
              * @param {object} context - context config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createContext = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var context = pobj.context;
            if (typeof context == 'undefined') {
                paramMissingHint.push('"context" of type "object"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function createContext(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {string} contextKey - context key
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteContext = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var contextKey = pobj.contextKey;
            if (typeof contextKey == 'undefined') {
                paramMissingHint.push('"contextKey" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function deleteContext(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {number} limit (opt) - limit
                  * @param {number} locationId (opt) - location ID
                  * @param {number} offset (opt) - offset
                  * @param {number} providerId (opt) - provider ID
                  * @param {boolean} superseded (opt) - superseded
                  * @param {string} webkitConfigKey (opt) - webkit config key
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
          * @param {object} pobj
              * @param {string} contextKey - context key
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getContext = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var contextKey = pobj.contextKey;
            if (typeof contextKey == 'undefined') {
                paramMissingHint.push('"contextKey" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getContext(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {object} context - context config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateContext = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var context = pobj.context;
            if (typeof context == 'undefined') {
                paramMissingHint.push('"context" of type "object"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function updateContext(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} countryCode (opt) - country code; "DE", "GB", "PL", or other country codes that can be found by function findCountryConfig()
                  * @param {string} orderBy (opt) - order by
                  * @param {boolean} ascending (opt) - in ascending order nor not
                  * @param {number} offset (opt) - offset of the results
                  * @param {number} limit (opt) - limit of the results
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
          * @param {object} pobj
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
          * @desc find location, API base path: /smp/api/locations, API full path: /smp/api/locations
          * @param {object} pobj
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} context (opt) - context
                  * @param {string} limit (opt) - number of results to show
                  * @param {string} offset (opt) - offset of the results to show
                  * @param {string} providerId (opt) - ID of the provider
                  * @param {string} radius (opt) - search radius
                  * @param {string} regionSignature (opt) - signature of the region
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findLocation = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                url: 'locations',
                urlParam: $.extend({context:self.getProperty('contextKey')},criteria),
                functionName: 'findLocation()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get location, API base path: /smp/api/locations, API full path: /smp/api/locations/{locationId}
          * @param {object} pobj
              * @param {string} locationId (opt) - ID of the location; if not set, default value would be self.getProperty('locationId')
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getLocation = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var locationId = pobj.locationId || self.getProperty('locationId');
            var obj = {
                url: 'locations/' + locationId,
                functionName: 'getLocation()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc create mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates
          * @param {object} pobj
              * @param {object} mailTemplate - mail template; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} mailConfigId - ID of the mail configuration
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createMailTemplate = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var mailTemplate = pobj.mailTemplate;
            if (typeof mailTemplate == 'undefined') {
                paramMissingHint.push('"mailTemplate" of type "object"');
            }
            if (typeof mailTemplate == 'undefined' || typeof mailTemplate.mailConfigId == 'undefined') {
                paramMissingHint.push('"mailConfigId" of type "string" in "mailTemplate"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function createMailTemplate(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'POST',
                url: 'mailconfigs/' + mailTemplate.mailConfigId + '/templates',
                data: JSON.stringify(mailTemplate),
                functionName: 'createMailTemplate()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete all mail templates, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates
          * @param {object} pobj
              * @param {string} mailConfigId - ID of the mail configuration
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteAllMailTemplates = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                paramMissingHint.push('"mailConfigId" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function deleteAllMailTemplates(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {string} mailConfigId - ID of the mail configuration
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteMailConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                paramMissingHint.push('"mailConfigId" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function deleteMailConfig(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {string} mailConfigId - ID of the mail configuration
              * @param {string} templateId - ID of the mail template
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteMailTemplate = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                paramMissingHint.push('"mailConfigId" of type "string"');
            }
            var templateId = pobj.templateId;
            if (typeof templateId == 'undefined') {
                paramMissingHint.push('"templateId" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function deleteMailTemplate(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} countryCode (opt) - country code; "DE", "GB", "PL", or other country codes that can be found by function findCountryConfig()
                  * @param {boolean} isPublic (opt) - whether the mail configuration is public or not
                  * @param {string} languageCode (opt) - language code; "de", "en", "pl", or other language codes that can be found by function findCountryConfig()
                  * @param {string} name (opt) - name of the mail configuration
                  * @param {number} providerId (opt) - ID of the provider
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
          * @param {object} pobj
              * @param {object} criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} mailConfigId - ID of the mail configuration
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findMailTemplate = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            if (typeof criteria == 'undefined') {
                paramMissingHint.push('"criteria" of type "object"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findMailTemplate(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {string} mailConfigId - ID of the mail configuration
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getMailConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                paramMissingHint.push('"mailConfigId" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getMailConfig(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {string} mailConfigId - ID of the mail configuration
              * @param {string} templateId - ID of the mail template
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getMailTemplate = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                paramMissingHint.push('"mailConfigId" of type "string"');
            }
            var templateId = pobj.templateId;
            if (typeof templateId == 'undefined') {
                paramMissingHint.push('"templateId" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getMailTemplate(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {string} mailConfigId - ID of the mail configuration
              * @param {object} mailConfig - mail configuration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateMailConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var mailConfigId = pobj.mailConfigId;
            if (typeof mailConfigId == 'undefined') {
                paramMissingHint.push('"mailConfigId" of type "string"');
            }
            var mailConfig = pobj.mailConfig;
            if (typeof mailConfig == 'undefined') {
                paramMissingHint.push('"mailConfig" of type "object"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function updateMailConfig(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {object} mailTemplate - mail template; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} mailConfigId - ID of the mail configuration
                  * @param {string} id - ID of the mail template
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateMailTemplate = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var mailTemplate = pobj.mailTemplate;
            if (typeof mailTemplate == 'undefined') {
                paramMissingHint.push('"mailTemplate" of type "object"');
            }
            if (typeof mailTemplate == 'undefined' || typeof mailTemplate.mailConfigId == 'undefined') {
                paramMissingHint.push('"mailConfigId" of type "string" in "mailTemplate"');
            }
            if (typeof mailTemplate == 'undefined' || typeof mailTemplate.id == 'undefined') {
                paramMissingHint.push('"id" of type "string" in "mailTemplate"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function updateMailTemplate(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'PUT',
                url: 'mailconfigs/' + mailTemplate.mailConfigId + '/templates/' + mailTemplate.id,
                data: JSON.stringify(mailTemplate),
                functionName: 'updateMailTemplate()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get all part qualities, API base path: /smp/api/partqualities, API full path: /smp/api/partqualities
          * @param {object} pobj
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getAllPartQualities = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var obj = {
                url: 'partqualities',
                functionName: 'getAllPartQualities()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find region, API base path: /smp/api/regions, API full path: /smp/api/regions
          * @param {object} pobj
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} searchTerm (opt) - search term
              * @param {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects.
                    The structure of each object in parameter data:
                        formattedName - string, formatted name of the region
                        nearbyLocationCount - number, number of nearby locations
                        signature - string, region signature
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
          * @param {object} pobj
              * @param {string} signature - region signature
              * @param {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type object.
                    The structure of the parameter data:
                        formattedName - string, formatted name of the region
                        nearbyLocationCount - number, number of nearby locations
                        signature - string, region signature
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getRegionBySignature = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var signature = pobj.signature;
            if (typeof signature == 'undefined') {
                paramMissingHint.push('"signature" of type "string"');
            }
            var quickHandle = pobj.quickHandle;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getRegionBySignature(): ' + paramMissingHint.join(', '));
                return;
            }
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
          * @param {object} pobj
              * @param {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type object.
                    The structure of the parameter data:
                        formattedName - string, formatted name of the region
                        nearbyLocationCount - number, number of nearby locations
                        signature - string, region signature
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
          * @param {object} pobj
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} searchTerm (opt) - search term, name of the service
                  * @param {string} vehicleTypeId (opt) - ID of vehicle type
                  * @param {string} constructionTime (opt) - construction time of the vehicle, in the format "YYYY-MM-01"
                  * @param {number} numResults (opt) - number of results
              * @param {function} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects
                    The structure of each object in parameter data:
                        serviceId - number, ID of the service
                        serviceName - string, name of the service
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
          * @desc find service by catalog, API base path: /smp/api/services/catalog, API full path: /smp/api/services/catalog/{serviceCategoryId}
          * @param {object} pobj
              * @param {string} serviceCategoryId - ID of service category
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} constructionTime (opt) - construction time of the vehicle, in the format "YYYY-MM-01"
                  * @param {string} vehicleTypeId (opt) - ID of vehicle type
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findServiceByCatalog = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var serviceCategoryId = pobj.serviceCategoryId;
            if (typeof serviceCategoryId == 'undefined') {
                paramMissingHint.push('"serviceCategoryId" of type "string"');
            }
            var criteria = pobj.criteria;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findServiceByCatalog(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                url: 'services/catalog/' + serviceCategoryId,
                urlParam: criteria,
                functionName: 'findServiceByCatalog()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find top services for vehicle with ID of vehicle type, API base path: /smp/api/services/services/top, API full path: /smp/api/services/services/top/{vehicleTypeId}
          * @param {object} pobj
              * @param {string} vehicleTypeId - ID of vehicle type
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} constructionTime (opt) - construction time of the vehicle, in the format "YYYY-MM-01"
                  * @param {number} numResults (opt) - number of results to show
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findTopServiceForVehicle = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var vehicleTypeId = pobj.vehicleTypeId;
            if (typeof vehicleTypeId == 'undefined') {
                paramMissingHint.push('"vehicleTypeId" of type "string"');
            }
            var criteria = pobj.criteria;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findTopServiceForVehicle(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                url: 'services/services/top/' + vehicleTypeId,
                urlParam: criteria,
                functionName: 'findTopServiceForVehicle()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get all inspection service positions, API base path: /smp/api/services/servicepositions, API full path: /smp/api/services/servicepositions/{serviceId}/{vehicleTypeId}/{constructionTime}
          * @param {object} pobj
              * @param {string or number} vehicleTypeId - ID of vehicle type
              * @param {string or number} serviceId - ID of the inspection service
              * @param {string} constructionTime - construction time of the vehicle, in the format "YYYY-MM-01"
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} equipmentCodes (opt) - equipment code of the vehicle
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getAllInspectionServicePositions = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var vehicleTypeId = pobj.vehicleTypeId;
            if (typeof vehicleTypeId == 'undefined') {
                paramMissingHint.push('"vehicleTypeId" of type "string or number"');
            }
            var serviceId = pobj.serviceId;
            if (typeof serviceId == 'undefined') {
                paramMissingHint.push('"serviceId" of type "string or number"');
            }
            var constructionTime = pobj.constructionTime;
            if (typeof constructionTime == 'undefined') {
                paramMissingHint.push('"constructionTime" of type "string"');
            }
            var criteria = pobj.criteria;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getAllInspectionServicePositions(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                url: 'services/servicepositions/' + serviceId + '/' + vehicleTypeId + '/' + constructionTime,
                urlParam: criteria,
                functionName: 'getAllInspectionServicePositions()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get service by service ID, API base path: /smp/api/services/services, API full path: /smp/api/services/services/{id}
          * @param {object} pobj
              * @param {string} serviceId - ID of service
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} constructionTime (opt) - construction time of the vehicle, in the format "YYYY-MM-01"
                  * @param {string} vehicleTypeId (opt) - ID of vehicle type
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getServiceById = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var serviceId = pobj.serviceId;
            if (typeof serviceId == 'undefined') {
                paramMissingHint.push('"serviceId" of type "string"');
            }
            var criteria = pobj.criteria;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getServiceById(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                url: 'services/services/' + serviceId,
                functionName: 'getServiceById()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get service category, API base path: /smp/api/services/servicecategories, API full path: /smp/api/services/servicecategories/{serviceCategoryId}
          * @param {object} pobj
              * @param {string} serviceCategoryId - ID of service category
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getServiceCategory = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var serviceCategoryId = pobj.serviceCategoryId;
            if (typeof serviceCategoryId == 'undefined') {
                paramMissingHint.push('"serviceCategoryId" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getServiceCategory(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                url: 'services/servicecategories/' + serviceCategoryId,
                functionName: 'getServiceCategory()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc register as individual FairGarage user. If this step is successful, the user will receive an email concerning setting the password, to complete the registration, API base path: /smp/api/users, API full path: /smp/api/users
          * @param {object} pobj
              * @param {string} registrationData - data of registration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} salutation - salutation
                  * @param {string} givenname - given name
                  * @param {string} surname - surname
                  * @param {string} emailAddress - email address
                  * @param {array of objects, the agreement objects can be obtained by findAgreement} acceptedAgreements - accepted agreements
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.registerUser = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var registrationData = pobj.registrationData;
            if (typeof registrationData == 'undefined') {
                paramMissingHint.push('"registrationData" of type "string"');
            }
            if (typeof registrationData == 'undefined' || typeof registrationData.salutation == 'undefined') {
                paramMissingHint.push('"salutation" of type "string" in "registrationData"');
            }
            if (typeof registrationData == 'undefined' || typeof registrationData.givenname == 'undefined') {
                paramMissingHint.push('"givenname" of type "string" in "registrationData"');
            }
            if (typeof registrationData == 'undefined' || typeof registrationData.surname == 'undefined') {
                paramMissingHint.push('"surname" of type "string" in "registrationData"');
            }
            if (typeof registrationData == 'undefined' || typeof registrationData.emailAddress == 'undefined') {
                paramMissingHint.push('"emailAddress" of type "string" in "registrationData"');
            }
            if (typeof registrationData == 'undefined' || typeof registrationData.acceptedAgreements == 'undefined') {
                paramMissingHint.push('"acceptedAgreements" of type "array of objects, the agreement objects can be obtained by findAgreement" in "registrationData"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function registerUser(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {string} categoryId - vehicle category ID. To find IDs of the next category, start with "62303" for SUV/passenger cars, or "83503" for transporters
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} constructionTime (opt) - construction time of the vehicle, in the format "YYYY-MM-01"
              * @param {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects.
                    The structure of each object in the parameter data:
                        lastLevel - boolean, if the last category level is reached
                        id - number, ID of the category; or ID of the vehicle type (if the last level is reached)
                        name - string, name of the category
                        externalId - string, external ID or Ecode of the vehicle (if the last level is reached)
                        properties - array of objects of the vehicle (if the last level is reached)
                            The structure of each property object:
                                name - string, name of the property
                                value - string, value of the property
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleByCatalog = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var categoryId = pobj.categoryId;
            if (typeof categoryId == 'undefined') {
                paramMissingHint.push('"categoryId" of type "string"');
            }
            var criteria = pobj.criteria;
            var quickHandle = pobj.quickHandle;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findVehicleByCatalog(): ' + paramMissingHint.join(', '));
                return;
            }
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
          * @param {object} pobj
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} externalId (opt) - external ID or Ecode of the vehicle
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
          * @param {object} pobj
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {string} hsn (opt) - HSN of the vehicle
                  * @param {string} tsn (opt) - TSN of the vehicle
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
          * @param {object} pobj
              * @param {string} vehicleTypeId - ID of vehicle type
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleEquipment = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var vehicleTypeId = pobj.vehicleTypeId;
            if (typeof vehicleTypeId == 'undefined') {
                paramMissingHint.push('"vehicleTypeId" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findVehicleEquipment(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {string} vehicleTypeId - ID of vehicle type
              * @param {string} serviceId - ID of the service
              * @param {string} constructionTime - construction time of the vehicle, in the format "YYYY-MM-01"
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleEquipmentForService = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var vehicleTypeId = pobj.vehicleTypeId;
            if (typeof vehicleTypeId == 'undefined') {
                paramMissingHint.push('"vehicleTypeId" of type "string"');
            }
            var serviceId = pobj.serviceId;
            if (typeof serviceId == 'undefined') {
                paramMissingHint.push('"serviceId" of type "string"');
            }
            var constructionTime = pobj.constructionTime;
            if (typeof constructionTime == 'undefined') {
                paramMissingHint.push('"constructionTime" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findVehicleEquipmentForService(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {string} vin - VIN of the vehicle
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getVehicleByVIN = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var vin = pobj.vin;
            if (typeof vin == 'undefined') {
                paramMissingHint.push('"vin" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getVehicleByVIN(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {string} vehicleTypeId - ID of vehicle type
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getVehicleByVehicleTypeId = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var vehicleTypeId = pobj.vehicleTypeId;
            if (typeof vehicleTypeId == 'undefined') {
                paramMissingHint.push('"vehicleTypeId" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getVehicleByVehicleTypeId(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {object} webkitConfig - webkit config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createWebkitConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var webkitConfig = pobj.webkitConfig;
            if (typeof webkitConfig == 'undefined') {
                paramMissingHint.push('"webkitConfig" of type "object"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function createWebkitConfig(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'POST',
                url: 'webkit/webkitconfigs',
                data: JSON.stringify(webkitConfig),
                functionName: 'createWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs/{key}
          * @param {object} pobj
              * @param {string} webkitConfigKey - webkit config key
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteWebkitConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var webkitConfigKey = pobj.webkitConfigKey;
            if (typeof webkitConfigKey == 'undefined') {
                paramMissingHint.push('"webkitConfigKey" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function deleteWebkitConfig(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @param {number} limit (opt) - limit
                  * @param {number} offset (opt) - offset
                  * @param {number} providerId (opt) - provider ID
                  * @param {boolean} superseded (opt) - superseded
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
          * @param {object} pobj
              * @param {string} webkitConfigKey - webkit config key
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getWebkitConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var webkitConfigKey = pobj.webkitConfigKey;
            if (typeof webkitConfigKey == 'undefined') {
                paramMissingHint.push('"webkitConfigKey" of type "string"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getWebkitConfig(): ' + paramMissingHint.join(', '));
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
          * @param {object} pobj
              * @param {object} webkitConfig - webkit config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateWebkitConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var webkitConfig = pobj.webkitConfig;
            if (typeof webkitConfig == 'undefined') {
                paramMissingHint.push('"webkitConfig" of type "object"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function updateWebkitConfig(): ' + paramMissingHint.join(', '));
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