
(function($){
    
    var console = window.console || {};
    console.error = window.console.error || function(){};

    window.fg = function(fgObj){
        var self = {};
        var varPrivate = {};
        
        self.properties = {
            ssl: 'http',
            env: 'api',
            apiBase: '.fairgarage.de/smp/api/',
            languageCode: 'de',
            countryCode: 'DE'
        };
        
        /** 
          * @desc set properties in self.properties
          * @param {object} newProperties - object with new properties to be added/modified
              * @key {string} apiBase - base URL of FairGarage API, default value is '.fairgarage.de/smp/api/'
              * @key {string} contextKey - context key used in FairGarage API
              * @key {string} countryCode - country code; "DE", "GB", "PL", or other country codes that can be found by function findCountryConfig(), default value 'DE'
              * @key {string} env - environment of FairGarage API, default value is 'api'
              * @key {function} error - default error function to be used in FairGarage API
              * @key {string} languageCode - language code; "de", "en", "pl", or other language codes that can be found by function findCountryConfig(), default value 'de'
              * @key {string} ssl - 'http' (default) or 'https'
              * @key {object} selectedVehicle - the vehicle object used in FairGarage API. It has 3 keys:
                    @key {object} constructionTime: the construction time object has one key, 'time', which stores the timestamp of the construction time of the vehicle. The value could be automatically saved, if saveVehicle in the corresponding functions is set to true.
                    @key {array of objects} equipmentList: each object of the list is a FairGarage equipment object
                    @key {object} vehicleType: the FairGarage vehicle object
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
                                    except modifications in "url", "error"
        */
        self.api = function(obj){
            var functionName = obj.functionName || 'api()';
            var type = obj.type || 'GET';
            var urlParam = obj.urlParam || {};
            var url = ((['http','https'].indexOf(self.getProperty('ssl')) >= 0) ? self.getProperty('ssl') : 'http') + '://' + self.getProperty('env') + self.getProperty('apiBase') + (obj.apiUrl || 'authentication/login') + (varPrivate.sessionId ? ';jsessionid=' + varPrivate.sessionId : '') + ('?' + $.param($.extend({contextKey:self.getProperty('contextKey')},urlParam)));
            //var forceNoSession = obj.forceNoSession ? true : false;
            //url = forceNoSession ? url : appendSession(url);
            var error = obj.error || function(jqXHR,textStatus,errorThrown){
                try {
                    var errMsg = [];
                    $.each(jqXHR.responseJSON,function(){
                        var temp;
                        if (this.field) {
                            temp = this.field.split('.')[1] || this.field.split('.')[0] + ' of the payload' + (this.errorMessage ? ', ' + this.errorMessage : ' error');
                        } else {
                            temp = this.errorMessage;
                        }
                        errMsg.push(temp);
                    });
                    self.error('Network Error: ' + textStatus + ', ' + errorThrown + '. ' + errMsg.join('; '));
                } catch (err) {
                    self.error('Error in FairGarage API when trying to use function ' + functionName);
                }
            };
            
            var ajaxObj = {
                type: type,
                async: obj.async || true,
                cache: obj.cache || false,
                url: url,
                contentType: obj.contentType || 'application/json;charset=UTF-8',
                dataType: obj.dataType || 'json',
                data: obj.data || '',
                error: error
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
          * @desc get first construction time of the vehicle in FairGarage date format to timestamp number
          * @param {object} constructionTimeMap - vehicle construction time map in FairGarage format
          * @return {string} FairGarage date, YYYY-MM-01
        */
        self.getFirstDateInConstructionTimeMap = function(constructionTimeMap){
            var years = [];
            for (var year in constructionTimeMap) {
                years.push(year);
            };
            var year = years.sort()[0];
            return (year + '-' + ('0' + constructionTimeMap[year].sort(function(a,b){return a-b})[0]).slice(-2) + '-01');
        }
        
        /**
          * @desc convert FairGarage date string to timestamp number
          * @param {string} date - FairGarage date string, in the format YYYY-MM-01, or YYYY-M-01
          * @return {number} timestamp
        */
        self.dateToTimestamp = function(date){
            if (!(/\d{4}\-\d{2}\-01/.test(date) || /\d{4}\-\d{1}\-01/.test(date))) {
                return self.error('Please write the date in the format YYYY-MM-01, e.g. "2008-01-01"');
            }
            var year = date.split('-')[0];
            var month = parseInt(date.split('-')[1])-1;
            return (new Date(year,month)).getTime();
        }
        
        /** 
          * @desc find FairGarage agreements, API base path: /smp/api/agreements, API full path: /smp/api/agreements
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects. The response can be directly used for the registration.
                    The structure of each object in parameter data:
                        providerId - ID of the providerId (1 for FairGarage)
                        agreementId - ID of the agreement
                        agreementVersionId - version ID of the agreement
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                apiUrl: 'agreements',
                urlParam: $.extend({context:self.getProperty('contextKey')},criteria),
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
                    if (typeof success == 'function') {success(data);}
                },
                functionName: 'findAgreement()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc check login status, API base path: /smp/api/authentication/login, API full path: /smp/api/authentication/login
          * @param {object} pobj
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                    if (typeof success == 'function') {success(data);}
                },
                error: function(jqXHR,textStatus,errorThrown){
                    delete varPrivate.sessionId;
                    if (typeof error == 'function') {error(jqXHR,textStatus,errorThrown);}
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
              * @key {function(data)} newAgreements - to display the new agreements whenever there is an update of them, with parameter (data) of type object.
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
              * @key {object} loginData - data of login; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} username - username
                  * @key {string} password - password
                  * @key {array of objects} agreementVersions (opt) - agreement versions
                        an agreement version is in the form {agreementId: 'agreementId'}
              * @key {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type object.
                    The structure of parameter data:
                        authorities - array of strings, authorities of the user
                        emailAddress - string, email address of the user
                        givenname - string, given name of the user
                        middlename - string, middle name of the user
                        surname - string, surname of the user
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                newAgreements = '';
            }
            var loginData = pobj.loginData;
            if (typeof loginData == 'undefined') {
                paramMissingHint.push('"loginData" of type "object"');
                loginData = {};
            }
            if (typeof loginData.username == 'undefined') {
                paramMissingHint.push('"username" of type "string" in "loginData"');
                
            }
            if (typeof loginData.password == 'undefined') {
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
                    if (typeof success == 'function') {success(data);}
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
                    if (typeof complete == 'function') {complete(jqXHR,textStatus);}
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
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                apiUrl: 'authentication/logout',
                error: function(jqXHR,textStatus,errorThrown){
                    if (typeof error == 'function') {error(jqXHR,textStatus,errorThrown);}
                },
                complete: function(jqXHR,textStatus){
    	            delete varPrivate.sessionId;
    	            if (typeof complete == 'function') {complete(jqXHR,textStatus);}
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
              * @key {object} context - context config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                context = {};
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function createContext(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'POST',
                apiUrl: 'contexts',
                urlParam: {providerId:context.providerId},
                data: JSON.stringify(context),
                functionName: 'createContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete context, API base path: /smp/api/contexts, API full path: /smp/api/contexts/{key}
          * @param {object} pobj
              * @key {string} contextKey - context key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                contextKey = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function deleteContext(): ' + paramMissingHint.join(', '));
                return;
            }
            var error = ajax.error;
            var obj = {
                apiUrl: 'contexts/' + contextKey,
                type: 'DELETE',
                error: function(jqXHR,textStatus,errorThrown){
                    if (typeof error == 'function') {error(jqXHR,textStatus,errorThrown);}
                },
                functionName: 'deleteContext()'
            };
            delete ajax.error;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find context, API base path: /smp/api/contexts, API full path: /smp/api/contexts
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {number} limit (opt) (API url parameter) - limit
                  * @key {number} locationId (opt) (API url parameter) - location ID
                  * @key {number} offset (opt) (API url parameter) - offset
                  * @key {number} providerId (opt) (API url parameter) - provider ID
                  * @key {boolean} superseded (opt) (API url parameter) - superseded
                  * @key {string} webkitConfigKey (opt) (API url parameter) - webkit config key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findContext = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'contexts',
                urlParam: criteria,
                functionName: 'findContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get context, API base path: /smp/api/contexts, API full path: /smp/api/contexts/{key}
          * @param {object} pobj
              * @key {string} contextKey - context key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                contextKey = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getContext(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'contexts/' + contextKey,
                functionName: 'getContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc update/put context, API base path: /smp/api/contexts, API full path: /smp/api/contexts/{key}
          * @param {object} pobj
              * @key {object} context - context config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                context = {};
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function updateContext(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'PUT',
                apiUrl: 'contexts/' + context.key,
                data: JSON.stringify(context),
                urlParam: {providerId:context.providerId},
                functionName: 'updateContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find country configuration, API base path: /smp/api/countryconfig, API full path: /smp/api/countryconfig
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} countryCode (opt) (API url parameter) - country code; "DE", "GB", "PL", or other country codes that can be found by function findCountryConfig()
                  * @key {string} orderBy (opt) (API url parameter) - order by
                  * @key {boolean} ascending (opt) (API url parameter) - in ascending order nor not
                  * @key {number} offset (opt) (API url parameter) - offset of the results
                  * @key {number} limit (opt) (API url parameter) - limit of the results
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findCountryConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'countryconfig',
                urlParam: criteria,
                functionName: 'findCountryConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get country configuration of the current context, API base path: /smp/api/countryconfig/current, API full path: /smp/api/countryconfig/current
          * @param {object} pobj
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getCurrentCountryConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var obj = {
                apiUrl: 'countryconfig/current',
                functionName: 'getCurrentCountryConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find location, API base path: /smp/api/locations, API full path: /smp/api/locations
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} context (opt) (API url parameter) - context
                  * @key {string} limit (opt) (API url parameter) - number of results to show
                  * @key {string} offset (opt) (API url parameter) - offset of the results to show
                  * @key {string} providerId (opt) (API url parameter) - ID of the provider
                  * @key {string} radius (opt) (API url parameter) - search radius
                  * @key {string} regionSignature (opt) (API url parameter) - signature of the region
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findLocation = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'locations',
                urlParam: $.extend({context:self.getProperty('contextKey')},criteria),
                functionName: 'findLocation()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get location, API base path: /smp/api/locations, API full path: /smp/api/locations/{locationId}
          * @param {object} pobj
              * @key {string} locationId - ID of the location; if not set, default value would be self.getProperty('locationId')
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getLocation = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var locationId = pobj.locationId || self.getProperty('locationId');
            if (typeof locationId == 'undefined') {
                paramMissingHint.push('"locationId" of type "string"');
                locationId = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getLocation(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'locations/' + locationId,
                functionName: 'getLocation()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc create mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs
          * @param {object} pobj
              * @key {object} mailConfig - mail configuration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} countryCode - country code; "DE", "GB", "PL", or other country codes that can be found by function findCountryConfig()
                  * @key {string} languageCode - language code; "de", "en", "pl", or other language codes that can be found by function findCountryConfig()
                  * @key {string} name - name of the mail configuration
                  * @key {number} providerId - ID of the provider
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createMailConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var mailConfig = pobj.mailConfig;
            if (typeof mailConfig == 'undefined') {
                paramMissingHint.push('"mailConfig" of type "object"');
                mailConfig = {};
            }
            if (typeof mailConfig.countryCode == 'undefined') {
                var defaultValue = self.getProperty('countryCode');
                if (defaultValue) {
                    mailConfig.countryCode = defaultValue;
                } else {
                    paramMissingHint.push('"countryCode" of type "string" in "mailConfig"');
                }
            }
            if (typeof mailConfig.languageCode == 'undefined') {
                var defaultValue = self.getProperty('languageCode');
                if (defaultValue) {
                    mailConfig.languageCode = defaultValue;
                } else {
                    paramMissingHint.push('"languageCode" of type "string" in "mailConfig"');
                }
            }
            if (typeof mailConfig.name == 'undefined') {
                paramMissingHint.push('"name" of type "string" in "mailConfig"');
                
            }
            if (typeof mailConfig.providerId == 'undefined') {
                var defaultValue = self.getProperty('providerId');
                if (defaultValue) {
                    mailConfig.providerId = defaultValue;
                } else {
                    paramMissingHint.push('"providerId" of type "number" in "mailConfig"');
                }
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function createMailConfig(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'POST',
                apiUrl: 'mailconfigs',
                data: JSON.stringify(mailConfig),
                functionName: 'createMailConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc create mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates
          * @param {object} pobj
              * @key {object} mailTemplate - mail template; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} mailConfigId - ID of the mail configuration
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                mailTemplate = {};
            }
            if (typeof mailTemplate.mailConfigId == 'undefined') {
                paramMissingHint.push('"mailConfigId" of type "string" in "mailTemplate"');
                
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function createMailTemplate(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'POST',
                apiUrl: 'mailconfigs/' + mailTemplate.mailConfigId + '/templates',
                data: JSON.stringify(mailTemplate),
                functionName: 'createMailTemplate()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete all mail templates, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates
          * @param {object} pobj
              * @key {string} mailConfigId - ID of the mail configuration
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                mailConfigId = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function deleteAllMailTemplates(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'DELETE',
                apiUrl: 'mailconfigs/' + mailConfigId + '/templates',
                functionName: 'deleteAllMailTemplates()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{id}
          * @param {object} pobj
              * @key {string} mailConfigId - ID of the mail configuration
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                mailConfigId = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function deleteMailConfig(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'DELETE',
                apiUrl: 'mailconfigs/' + mailConfigId,
                functionName: 'deleteMailConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates/{templateId}
          * @param {object} pobj
              * @key {string} mailConfigId - ID of the mail configuration
              * @key {string} templateId - ID of the mail template
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                mailConfigId = '';
            }
            var templateId = pobj.templateId;
            if (typeof templateId == 'undefined') {
                paramMissingHint.push('"templateId" of type "string"');
                templateId = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function deleteMailTemplate(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'DELETE',
                apiUrl: 'mailconfigs/' + mailConfigId + '/templates/' + templateId,
                functionName: 'deleteMailTemplate()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} countryCode (opt) (API url parameter) - country code; "DE", "GB", "PL", or other country codes that can be found by function findCountryConfig()
                  * @key {boolean} isPublic (opt) (API url parameter) - whether the mail configuration is public or not
                  * @key {string} languageCode (opt) (API url parameter) - language code; "de", "en", "pl", or other language codes that can be found by function findCountryConfig()
                  * @key {string} name (opt) (API url parameter) - name of the mail configuration
                  * @key {number} providerId (opt) (API url parameter) - ID of the provider
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findMailConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'mailconfigs',
                urlParam: criteria,
                functionName: 'findMailConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates
          * @param {object} pobj
              * @key {object} criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} mailConfigId (API url parameter) - ID of the mail configuration
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                criteria = {};
            }
            if (typeof criteria.mailConfigId == 'undefined') {
                paramMissingHint.push('"mailConfigId" of type "string" in "criteria"');
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findMailTemplate(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'mailconfigs/' + criteria.mailConfigId + '/templates',
                urlParam: criteria,
                functionName: 'findMailTemplate()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{id}
          * @param {object} pobj
              * @key {string} mailConfigId - ID of the mail configuration
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                mailConfigId = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getMailConfig(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'mailconfigs/' + mailConfigId,
                functionName: 'getMailConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates/{templateId}
          * @param {object} pobj
              * @key {string} mailConfigId - ID of the mail configuration
              * @key {string} templateId - ID of the mail template
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                mailConfigId = '';
            }
            var templateId = pobj.templateId;
            if (typeof templateId == 'undefined') {
                paramMissingHint.push('"templateId" of type "string"');
                templateId = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getMailTemplate(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'mailconfigs/' + mailConfigId + '/templates/' + templateId,
                functionName: 'getMailTemplate()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc update mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{id}
          * @param {object} pobj
              * @key {object} mailConfig - mail configuration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateMailConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var mailConfig = pobj.mailConfig;
            if (typeof mailConfig == 'undefined') {
                paramMissingHint.push('"mailConfig" of type "object"');
                mailConfig = {};
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function updateMailConfig(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'PUT',
                apiUrl: 'mailconfigs/' + mailConfig.id,
                data: JSON.stringify(mailConfig),
                functionName: 'updateMailConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc update mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates/{templateId}
          * @param {object} pobj
              * @key {object} mailTemplate - mail template; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} mailConfigId (API url parameter) - ID of the mail configuration
                  * @key {string} id (API url parameter) - ID of the mail template
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                mailTemplate = {};
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function updateMailTemplate(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'PUT',
                apiUrl: 'mailconfigs/' + mailTemplate.mailConfigId + '/templates/' + mailTemplate.id,
                data: JSON.stringify(mailTemplate),
                functionName: 'updateMailTemplate()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get offer by offer key, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerKey}
          * @param {object} pobj
              * @key {string} offerKey - offer key
              * @key {object} criteria (opt) - criteria to show the offer; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOffer = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var offerKey = pobj.offerKey;
            if (typeof offerKey == 'undefined') {
                paramMissingHint.push('"offerKey" of type "string"');
                offerKey = '';
            }
            var criteria = pobj.criteria;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getOffer(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'offers/list/' + offerKey,
                urlParam: criteria,
                functionName: 'getOffer()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get email template, used to send the offer, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerKey}/mailcontent
          * @param {object} pobj
              * @key {string} offerKey - offer key
              * @key {object} criteria (opt) - criteria to show the offer; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOfferEmail = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var offerKey = pobj.offerKey;
            if (typeof offerKey == 'undefined') {
                paramMissingHint.push('"offerKey" of type "string"');
                offerKey = '';
            }
            var criteria = pobj.criteria;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getOfferEmail(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'offers/list/' + offerKey + '/mailcontent',
                urlParam: criteria,
                functionName: 'getOfferEmail()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get offer list, API base path: /smp/api/offers/list, API full path: /smp/api/offers/list/{offerSearchKey}
          * @param {object} pobj
              * @key {string} offerSearchKey - offer search key
              * @key {object} criteria (opt) - criteria to show the results; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {number} limit (opt) (API url parameter) - number of results in list of offers
                  * @key {number} offset (opt) (API url parameter) - offset of results in list of offers
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOfferList = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var offerSearchKey = pobj.offerSearchKey;
            if (typeof offerSearchKey == 'undefined') {
                paramMissingHint.push('"offerSearchKey" of type "string"');
                offerSearchKey = '';
            }
            var criteria = pobj.criteria;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getOfferList(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'offers/list/' + offerSearchKey,
                urlParam: criteria,
                functionName: 'getOfferList()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get time slot for offer with offer key, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerKey}/timeslot
          * @param {object} pobj
              * @key {string} offerKey - offer key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOfferTimeSlot = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var offerKey = pobj.offerKey;
            if (typeof offerKey == 'undefined') {
                paramMissingHint.push('"offerKey" of type "string"');
                offerKey = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getOfferTimeSlot(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'offers/list/' + offerKey + '/timeslot',
                urlParam: criteria,
                functionName: 'getOfferTimeSlot()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc send the offer with the email template, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerKey}/mail
          * @param {object} pobj
              * @key {string} offerKey - offer key
              * @key {object} offerMail - offer email; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.sendOfferEmail = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var offerKey = pobj.offerKey;
            if (typeof offerKey == 'undefined') {
                paramMissingHint.push('"offerKey" of type "string"');
                offerKey = '';
            }
            var offerMail = pobj.offerMail;
            if (typeof offerMail == 'undefined') {
                paramMissingHint.push('"offerMail" of type "object"');
                offerMail = {};
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function sendOfferEmail(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'POST',
                apiUrl: 'offers/list/' + offerKey + '/mail',
                data: JSON.stringify(offerMail),
                functionName: 'sendOfferEmail()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc create offer search, API base path: /smp/api/offersearches, API full path: /smp/api/offersearches
          * @param {object} pobj
              * @key {object} offerSearch - use vehicle, region, and service to create an offer search; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {object} selectedVehicle - selected vehicle
                  * @key {array of objects} selectedServiceList - list of selected services
                  * @key {object} region (opt) - search offers in the given region
              * @key {object} criteria (opt) - other search criteria
                  * @key {boolean} generateEmpty (opt) (API url parameter) - whether locations with no offer will be included in the result list
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createOfferSearch = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var offerSearch = pobj.offerSearch;
            if (typeof offerSearch == 'undefined') {
                paramMissingHint.push('"offerSearch" of type "object"');
                offerSearch = {};
            }
            if (typeof offerSearch.selectedVehicle == 'undefined') {
                paramMissingHint.push('"selectedVehicle" of type "object" in "offerSearch"');
                
            }
            if (typeof offerSearch.selectedServiceList == 'undefined') {
                paramMissingHint.push('"selectedServiceList" of type "array of objects" in "offerSearch"');
                
            }
            var criteria = pobj.criteria;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function createOfferSearch(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'POST',
                apiUrl: 'offersearches',
                urlParam: criteria,
                data: JSON.stringify(offerSearch),
                functionName: 'createOfferSearch()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get offer search, API base path: /smp/api/offersearches, API full path: /smp/api/offersearches/{offerSearchKey}
          * @param {object} pobj
              * @key {string} offerSearchKey - offer search key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOfferSearch = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var offerSearchKey = pobj.offerSearchKey;
            if (typeof offerSearchKey == 'undefined') {
                paramMissingHint.push('"offerSearchKey" of type "string"');
                offerSearchKey = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getOfferSearch(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'GET',
                apiUrl: 'offersearches/' + offerSearchKey,
                functionName: 'getOfferSearch()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get all part qualities, API base path: /smp/api/partqualities, API full path: /smp/api/partqualities
          * @param {object} pobj
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getAllPartQualities = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var obj = {
                apiUrl: 'partqualities',
                functionName: 'getAllPartQualities()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find region, API base path: /smp/api/regions, API full path: /smp/api/regions
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} searchTerm (opt) (API url parameter) - search term
              * @key {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects.
                    The structure of each object in parameter data:
                        formattedName - string, formatted name of the region
                        nearbyLocationCount - number, number of nearby locations
                        signature - string, region signature
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                apiUrl: 'regions',
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
                    if (typeof success == 'function') {success(data);}
                },
                functionName: 'findRegion()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get region by region signature, API base path: /smp/api/regions/signature, API full path: /smp/api/regions/signature/{signature}
          * @param {object} pobj
              * @key {string} signature - region signature
              * @key {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type object.
                    The structure of the parameter data:
                        formattedName - string, formatted name of the region
                        nearbyLocationCount - number, number of nearby locations
                        signature - string, region signature
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                signature = '';
            }
            var quickHandle = pobj.quickHandle;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getRegionBySignature(): ' + paramMissingHint.join(', '));
                return;
            }
            var success = ajax.success;
            var obj = {
                apiUrl: 'regions/signature/' + signature,
                success: function(data){
                    if (typeof quickHandle == 'function') {
                        newData = {
                            formattedName: data.formattedName,
                            nearbyLocationCount: data.nearbyLocationCount,
                            signature: data.signature
                        };
                        quickHandle(newData);
                    }
                    if (typeof success == 'function') {success(data);}
                },
                functionName: 'getRegionBySignature()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get region of the user, API base path: /smp/api/regions/default, API full path: /smp/api/regions/default
          * @param {object} pobj
              * @key {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type object.
                    The structure of the parameter data:
                        formattedName - string, formatted name of the region
                        nearbyLocationCount - number, number of nearby locations
                        signature - string, region signature
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getRegionOfUser = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var obj = {
                apiUrl: 'regions/default',
                success: function(data){
                    if (typeof quickHandle == 'function') {
                        newData = {
                            formattedName: data.formattedName,
                            nearbyLocationCount: data.nearbyLocationCount,
                            signature: data.signature
                        };
                        quickHandle(newData);
                    }
                    if (typeof success == 'function') {success(data);}
                },
                functionName: 'getRegionOfUser()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find service, API base path: /smp/api/services/services, API full path: /smp/api/services/services
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} searchTerm (opt) (API url parameter) - search term, name of the service
                  * @key {string} vehicleTypeId (opt) (API url parameter) - ID of vehicle type
                  * @key {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the format "YYYY-MM-01"
                  * @key {number} numResults (opt) (API url parameter) - number of results
              * @key {function} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects
                    The structure of each object in parameter data:
                        serviceId - number, ID of the service
                        serviceName - string, name of the service
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                apiUrl: 'services/services',
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
                    if (typeof success == 'function') {success(data);}
                },
                functionName: 'findService()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find service by catalog, API base path: /smp/api/services/catalog, API full path: /smp/api/services/catalog/{serviceCategoryId}
          * @param {object} pobj
              * @key {string} serviceCategoryId - ID of service category
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the format "YYYY-MM-01"
                  * @key {string} vehicleTypeId (opt) (API url parameter) - ID of vehicle type
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                serviceCategoryId = '';
            }
            var criteria = pobj.criteria;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findServiceByCatalog(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'services/catalog/' + serviceCategoryId,
                urlParam: criteria,
                functionName: 'findServiceByCatalog()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find top services for vehicle with ID of vehicle type, API base path: /smp/api/services/services/top, API full path: /smp/api/services/services/top/{vehicleTypeId}
          * @param {object} pobj
              * @key {string} vehicleTypeId - ID of vehicle type
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the format "YYYY-MM-01"
                  * @key {number} numResults (opt) (API url parameter) - number of results to show
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                vehicleTypeId = '';
            }
            var criteria = pobj.criteria;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findTopServiceForVehicle(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'services/services/top/' + vehicleTypeId,
                urlParam: criteria,
                functionName: 'findTopServiceForVehicle()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get all inspection service positions, API base path: /smp/api/services/servicepositions, API full path: /smp/api/services/servicepositions/{serviceId}/{vehicleTypeId}/{constructionTime}
          * @param {object} pobj
              * @key {string or number} vehicleTypeId - ID of vehicle type
              * @key {string or number} serviceId - ID of the inspection service
              * @key {string} constructionTime - construction time of the vehicle, in the format "YYYY-MM-01"
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} equipmentCodes (opt) (API url parameter) - equipment code of the vehicle
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                vehicleTypeId = '';
            }
            var serviceId = pobj.serviceId;
            if (typeof serviceId == 'undefined') {
                paramMissingHint.push('"serviceId" of type "string or number"');
                serviceId = '';
            }
            var constructionTime = pobj.constructionTime;
            if (typeof constructionTime == 'undefined') {
                paramMissingHint.push('"constructionTime" of type "string"');
                constructionTime = '';
            }
            var criteria = pobj.criteria;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getAllInspectionServicePositions(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'services/servicepositions/' + serviceId + '/' + vehicleTypeId + '/' + constructionTime,
                urlParam: criteria,
                functionName: 'getAllInspectionServicePositions()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get service by service ID, API base path: /smp/api/services/services, API full path: /smp/api/services/services/{id}
          * @param {object} pobj
              * @key {string} serviceId - ID of service
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the format "YYYY-MM-01"
                  * @key {string} vehicleTypeId (opt) (API url parameter) - ID of vehicle type
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                serviceId = '';
            }
            var criteria = pobj.criteria;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getServiceById(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'services/services/' + serviceId,
                urlParam: criteria,
                functionName: 'getServiceById()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get service category, API base path: /smp/api/services/servicecategories, API full path: /smp/api/services/servicecategories/{serviceCategoryId}
          * @param {object} pobj
              * @key {string} serviceCategoryId - ID of service category
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                serviceCategoryId = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getServiceCategory(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'services/servicecategories/' + serviceCategoryId,
                functionName: 'getServiceCategory()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc register as individual FairGarage user. If this step is successful, the user will receive an email concerning setting the password, to complete the registration, API base path: /smp/api/users, API full path: /smp/api/users
          * @param {object} pobj
              * @key {string} registrationData - data of registration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} salutation - salutation
                  * @key {string} givenname - given name
                  * @key {string} surname - surname
                  * @key {string} emailAddress - email address
                  * @key {array of objects, the agreement objects can be obtained by findAgreement} acceptedAgreements - accepted agreements
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                registrationData = '';
            }
            if (typeof registrationData.salutation == 'undefined') {
                paramMissingHint.push('"salutation" of type "string" in "registrationData"');
                
            }
            if (typeof registrationData.givenname == 'undefined') {
                paramMissingHint.push('"givenname" of type "string" in "registrationData"');
                
            }
            if (typeof registrationData.surname == 'undefined') {
                paramMissingHint.push('"surname" of type "string" in "registrationData"');
                
            }
            if (typeof registrationData.emailAddress == 'undefined') {
                paramMissingHint.push('"emailAddress" of type "string" in "registrationData"');
                
            }
            if (typeof registrationData.acceptedAgreements == 'undefined') {
                paramMissingHint.push('"acceptedAgreements" of type "array of objects, the agreement objects can be obtained by findAgreement" in "registrationData"');
                
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function registerUser(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'users',
                type: 'POST',
                data: JSON.stringify(registrationData),
                functionName: 'registerUser()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc evaluate a vehicle, API base path: /smp/api/vehicles/evaluation, API full path: /smp/api/vehicles/evaluation
          * @param {object} pobj
              * @key {object} valuatedVehicle - vehicle information for the evaluation
                  * @key {object} datVehicleContainer - vehicle information used for the DAT evaluation; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                        The minimum structure of this object datVehicleContainer:
                            {object} vehicleType - vehicle type, the vehicle object returned by FairGarage API, by any searching method
                            {object} registrationDate - registration date
                                {number} time - registration date of the current vehicle, in timestamp
                            {number} milage - milage of the vehicle, please indicate the value in kilometer (km)
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} languageCode (opt) (API url parameter) - language code; "de", "en", "pl", or other language codes that can be found by function findCountryConfig()
                  * @key {string} countryCode (opt) (API url parameter) - country code; "DE", "GB", "PL", or other country codes that can be found by function findCountryConfig()
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.evaluateVehicle = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var valuatedVehicle = pobj.valuatedVehicle;
            if (typeof valuatedVehicle == 'undefined') {
                paramMissingHint.push('"valuatedVehicle" of type "object"');
                valuatedVehicle = {};
            }
            if (typeof valuatedVehicle.datVehicleContainer == 'undefined') {
                paramMissingHint.push('"datVehicleContainer" of type "object" in "valuatedVehicle"');
                
            }
            var criteria = pobj.criteria;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function evaluateVehicle(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'POST',
                apiUrl: 'vehicles/evaluation',
                urlParam: criteria,
                data: JSON.stringify($.extend(true,{datVehicleContainer:{registrationDate:{time:self.dateToTimestamp(self.getFirstDateInConstructionTimeMap(valuatedVehicle.datVehicleContainer.vehicleType.constructionTimeMap))}}},valuatedVehicle)),
                functionName: 'evaluateVehicle()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find vehicle by catalog, API base path: /smp/api/vehicles/catalog, API full path: /smp/api/vehicles/catalog/{vehicleCategoryId}
          * @param {object} pobj
              * @key {string} categoryId - vehicle category ID. To find IDs of the next category, start with "62303" (default) for SUV/passenger cars, or "83503" for transporters
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the format "YYYY-MM-01"
              * @key {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects.
                    The structure of each object in the parameter data:
                        {boolean} lastLevel - if the last category level is reached
                        {number} id - ID of the category; or ID of the vehicle type (if the last level is reached)
                        {string} name - name of the category
                        {string} externalId - external ID or Ecode of the vehicle (if the last level is reached)
                        {array of objects} properties - each of which are objects of the vehicle (if the last level is reached)
                            The structure of each property object:
                                {string} name - name of the property
                                {string} value - value of the property
              * @key {boolean} saveVehicle (opt) - save the found vehicle, if only one vehicle is found, by setProperties into "vehicle"
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleByCatalog = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var categoryId = pobj.categoryId || '62303';
            if (typeof categoryId == 'undefined') {
                paramMissingHint.push('"categoryId" of type "string"');
                categoryId = '';
            }
            var criteria = pobj.criteria;
            var quickHandle = pobj.quickHandle;
            var saveVehicle = pobj.saveVehicle;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findVehicleByCatalog(): ' + paramMissingHint.join(', '));
                return;
            }
            var success = ajax.success;
            var obj = {
                apiUrl: 'vehicles/catalog/' + categoryId,
                urlParam: criteria,
                success: function(data){
                    if (data.categories && data.categories.length == 0 && data.types && data.types.length == 0 && data.ancestors && data.ancestors.length > 0) {
                        self.error('The requested ID ' + categoryId + ' is not a valid category ID. This might be an ID of vehicle type. Please try to use function getVehicleByVehicleTypeId().');
                        return;
                    }
                    if (saveVehicle && data.types.length == 1) {
                        var selectedVehicle = {
                            constructionTime: {time:null},
                            equipmentList: [],
                            vehicleType: data.types[0]
                        };
                        var years = [];
                        for (var year in data.types[0].constructionTimeMap) {
                            years.push(year);
                        };
                        var year = years.sort()[0];
                        selectedVehicle.constructionTime.time = (criteria && criteria.constructionTime) ? self.dateToTimestamp(criteria.constructionTime) : self.dateToTimestamp(year + '-' + (data.types[0].constructionTimeMap[year].sort(function(a,b){return a-b})[0]));
                        //selectedVehicle.constructionTime.time = (criteria && criteria.constructionTime) ? self.dateToTimestamp(criteria.constructionTime) : self.dateToTimestamp(self.getFirstDateInConstructionTimeMap(data.types[0].constructionTimeMap)));
                        self.setProperties({selectedVehicle:selectedVehicle});
                    }
                    if (typeof quickHandle == 'function') {
                        var newData = [];
                        var key = 'categories';
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
                    if (typeof success == 'function') {success(data);}
                },
                functionName: 'findVehicleByCatalog()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find vehicle by documents, either externalId, or both hsn and tsn must be given in criteria, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} externalId (opt) (API url parameter) - external ID or Ecode of the vehicle
                  * @key {string} hsn (opt) (API url parameter) - HSN of the vehicle
                  * @key {string} tsn (opt) (API url parameter) - TSN of the vehicle
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleByDocument = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'vehicles/vehicletypes',
                urlParam: criteria,
                functionName: 'findVehicleByDocument()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find vehicle by the external ID of the vehicle, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes
          * @param {object} pobj
              * @key {string} externalId - external ID or Ecode of the vehicle
              * @key {boolean} saveVehicle (opt) - save the found vehicle, if only one vehicle is found, by setProperties into "vehicle"
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleByExternalId = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var externalId = pobj.externalId;
            if (typeof externalId == 'undefined') {
                paramMissingHint.push('"externalId" of type "string"');
                externalId = '';
            }
            var saveVehicle = pobj.saveVehicle;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findVehicleByExternalId(): ' + paramMissingHint.join(', '));
                return;
            }
            var success = ajax.success;
            var obj = {
                apiUrl: 'vehicles/vehicletypes',
                urlParam: {externalId:externalId},
                success: function(data){
                    if (saveVehicle && data.length == 1 && data[0] != null) {
                        var selectedVehicle = {
                            constructionTime: {time:null},
                            equipmentList: [],
                            vehicleType: data[0]
                        };
                        var years = [];
                        for (var year in data[0].constructionTimeMap) {
                            years.push(year);
                        };
                        var year = years.sort()[0];
                        selectedVehicle.constructionTime.time = self.dateToTimestamp(year + '-' + (data[0].constructionTimeMap[year].sort(function(a,b){return a-b})[0]));
                        self.setProperties({selectedVehicle:selectedVehicle});
                    }
                    if (typeof success == 'function') {success(data);}
                },
                functionName: 'findVehicleByExternalId()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find vehicle by HSN/TSN of the vehicle, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes
          * @param {object} pobj
              * @key {string} hsn - HSN of the vehicle
              * @key {string} tsn - TSN of the vehicle
              * @key {boolean} saveVehicle (opt) - save the found vehicle, if only one vehicle is found, by setProperties into "vehicle"
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleByHSNTSN = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var hsn = pobj.hsn;
            if (typeof hsn == 'undefined') {
                paramMissingHint.push('"hsn" of type "string"');
                hsn = '';
            }
            var tsn = pobj.tsn;
            if (typeof tsn == 'undefined') {
                paramMissingHint.push('"tsn" of type "string"');
                tsn = '';
            }
            var saveVehicle = pobj.saveVehicle;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findVehicleByHSNTSN(): ' + paramMissingHint.join(', '));
                return;
            }
            var success = ajax.success;
            var obj = {
                apiUrl: 'vehicles/vehicletypes',
                urlParam: {hsn:hsn,tsn:tsn},
                success: function(data){
                    if (saveVehicle && data.length == 1) {
                        var selectedVehicle = {
                            constructionTime: {time:null},
                            equipmentList: [],
                            vehicleType: data[0]
                        };
                        var years = [];
                        for (var year in data[0].constructionTimeMap) {
                            years.push(year);
                        };
                        var year = years.sort()[0];
                        selectedVehicle.constructionTime.time = self.dateToTimestamp(year + '-' + (data[0].constructionTimeMap[year].sort(function(a,b){return a-b})[0]));
                        self.setProperties({selectedVehicle:selectedVehicle});
                    }
                    if (typeof success == 'function') {success(data);}
                },
                functionName: 'findVehicleByHSNTSN()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find vehicle equipment, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes/{id}/equipments
          * @param {object} pobj
              * @key {string} vehicleTypeId - ID of vehicle type
              * @key {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects.
                    The structure of each object in parameter data:
                        
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                vehicleTypeId = '';
            }
            var quickHandle = pobj.quickHandle;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findVehicleEquipment(): ' + paramMissingHint.join(', '));
                return;
            }
            var success = ajax.success;
            var obj = {
                apiUrl: 'vehicles/vehicletypes/' + vehicleTypeId + '/equipments',
                success: function(data){
                    if (typeof quickHandle == 'function') {
                        var newData = [];
                        $.each(data,function(){
                            newData.push({
                                name: this.name,
                                equipment: this,
                                addEquipment: function(){
                                    if (self.getProperty('vehicle') && self.getProperty('vehicle').id == vehicleTypeId) {

                                    }
                                }
                            })
                        });
                    }
                    if (typeof success == 'function') {success(data);}
                },
                functionName: 'findVehicleEquipment()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find vehicle equipment for selected service, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes/{id}/equipments/{serviceId}/{constructionTime}
          * @param {object} pobj
              * @key {string} vehicleTypeId - ID of vehicle type
              * @key {string} serviceId - ID of the service
              * @key {string} constructionTime - construction time of the vehicle, in the format "YYYY-MM-01"
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                vehicleTypeId = '';
            }
            var serviceId = pobj.serviceId;
            if (typeof serviceId == 'undefined') {
                paramMissingHint.push('"serviceId" of type "string"');
                serviceId = '';
            }
            var constructionTime = pobj.constructionTime;
            if (typeof constructionTime == 'undefined') {
                paramMissingHint.push('"constructionTime" of type "string"');
                constructionTime = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function findVehicleEquipmentForService(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'vehicles/vehicletypes/' + vehicleTypeId + '/equipments/' + serviceId + '/' + constructionTime,
                functionName: 'findVehicleEquipmentForService()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get vehicle by vehicle type ID, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes/{id}
          * @param {object} pobj
              * @key {string} vehicleTypeId - ID of vehicle type
              * @key {boolean} saveVehicle (opt) - save the found vehicle, if only one vehicle is found, by setProperties into "vehicle"
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                vehicleTypeId = '';
            }
            var saveVehicle = pobj.saveVehicle;
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getVehicleByVehicleTypeId(): ' + paramMissingHint.join(', '));
                return;
            }
            var success = ajax.success;
            var obj = {
                apiUrl: 'vehicles/vehicletypes/' + vehicleTypeId,
                success: function(data){
                    if (saveVehicle && data) {
                        var selectedVehicle = {
                            constructionTime: {time:null},
                            equipmentList: [],
                            vehicleType: data
                        };
                        var years = [];
                        for (var year in data.constructionTimeMap) {
                            years.push(year);
                        };
                        var year = years.sort()[0];
                        selectedVehicle.constructionTime.time = self.dateToTimestamp(self.getFirstDateInConstructionTimeMap(data.constructionTimeMap));
                        self.setProperties({selectedVehicle:selectedVehicle});
                    }
                    if (typeof success == 'function') {success(data);}
                },
                functionName: 'getVehicleByVehicleTypeId()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc create webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs
          * @param {object} pobj
              * @key {object} webkitConfig - webkit config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                webkitConfig = {};
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function createWebkitConfig(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                type: 'POST',
                apiUrl: 'webkit/webkitconfigs',
                data: JSON.stringify(webkitConfig),
                functionName: 'createWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs/{key}
          * @param {object} pobj
              * @key {string} webkitConfigKey - webkit config key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                webkitConfigKey = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function deleteWebkitConfig(): ' + paramMissingHint.join(', '));
                return;
            }
            var error = ajax.error;
            var obj = {
                type: 'DELETE',
                apiUrl: 'webkit/webkitconfigs/' + webkitConfigKey,
                error: function(jqXHR,textStatus,errorThrown){
                    if (typeof error == 'function') {error(jqXHR,textStatus,errorThrown);}
                },
                functionName: 'deleteWebkitConfig()'
            };
            delete ajax.error;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {number} limit (opt) (API url parameter) - limit
                  * @key {number} offset (opt) (API url parameter) - offset
                  * @key {number} providerId (opt) (API url parameter) - provider ID
                  * @key {boolean} superseded (opt) (API url parameter) - superseded
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findWebkitConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'webkit/webkitconfigs',
                urlParam: criteria,
                functionName: 'findWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs/{key}
          * @param {object} pobj
              * @key {string} webkitConfigKey - webkit config key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                webkitConfigKey = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getWebkitConfig(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'webkit/webkitconfigs/' + webkitConfigKey,
                functionName: 'getWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc update/put webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs/{key}
          * @param {object} pobj
              * @key {object} webkitConfig - webkit config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
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
                webkitConfig = {};
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function updateWebkitConfig(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'webkit/webkitconfigs/' + webkitConfig.key,
                type: 'PUT',
                data: JSON.stringify(webkitConfig),
                functionName: 'updateWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        return self;
    }
    
})(jQuery);