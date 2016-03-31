
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
        
        self.setProperties = function(newProperties){
            if (newProperties == "help") {
                console.log("/** \r\n  * @desc set properties in self.properties\r\n  * @param {object} newProperties - object with new properties to be added/modified\r\n      * @param {string} apiBase - base URL of FairGarage API, default value is '.fairgarage.de/smp/api/'\r\n      * @param {string} contextKey - context key used in FairGarage API\r\n      * @param {string} countryCode - country code; \"DE\", \"GB\", \"PL\", or other country codes that can be found by function findCountryConfig(), default value 'DE'\r\n      * @param {string} env - environment of FairGarage API, default value is 'api'\r\n      * @param {function} error - default error function to be used in FairGarage API\r\n      * @param {string} languageCode - language code; \"de\", \"en\", \"pl\", or other language codes that can be found by function findCountryConfig(), default value 'de'\r\n      * @param {string} ssl - 'http' (default) or 'https'\r\n      * @param {object} selectedVehicle - the vehicle object used in FairGarage API. It has 3 keys:\r\n            {object} constructionTime: the construction time object has one key, 'time', which stores the timestamp of the construction time of the vehicle. The value could be automatically saved, if saveVehicle in the corresponding functions is set to true.\r\n            {array of objects} equipmentList: each object of the list is a FairGarage equipment object\r\n            {object} vehicleType: the FairGarage vehicle object\r\n*/\r\n");                return;
            }
            $.extend(self.properties,newProperties);
        }
        self.setProperties(fgObj);
        
        self.getProperty = function(propertyName){
            if (propertyName == "help") {
                console.log("/** \r\n  * @desc get property in self.properties\r\n  * @param {string} propertyName - object with new properties to be added/modified\r\n  * @return the value of the property, otherwise null, if propertyName not defined\r\n*/\r\n");                return;
            }
            return self.properties[propertyName];
        }
        
        self.removeProperties = function(properties){
            if (properties == "help") {
                console.log("/** \r\n  * @desc remove properties in self.properties\r\n  * @param {array of strings} properties - array with names of properties to be added/modified in self.properties\r\n*/\r\n");                return;
            }
            $.each(properties,function(){
                delete self.properties[this.toString()];
            });
        }
        
        self.api = function(obj){
            if (obj == "help") {
                console.log("/** \r\n  * @desc ajax request\r\n  * @param {object} obj - obj for jQuery ajax() function,\r\n                            except modifications in \"url\", \"error\"\r\n*/\r\n");                return;
            }
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
        
        self.error = function(str){
            if (str == "help") {
                console.log("/** \r\n  * @desc show error with error message in console\r\n  * @param {string} str - message string\r\n*/\r\n");                return;
            }
            console.error(str);
        }

        self.getFirstDateInConstructionTimeMap = function(constructionTimeMap){
            if (constructionTimeMap == "help") {
                console.log("/**\r\n  * @desc get first construction time of the vehicle in FairGarage date format to timestamp number\r\n  * @param {object} constructionTimeMap - vehicle construction time map in FairGarage format\r\n  * @return {string} FairGarage date, YYYY-MM-01\r\n*/\r\n");                return;
            }
            var years = [];
            for (var year in constructionTimeMap) {
                years.push(year);
            };
            var year = years.sort()[0];
            return (year + '-' + ('0' + constructionTimeMap[year].sort(function(a,b){return a-b})[0]).slice(-2) + '-01');
        }
        
        self.dateToTimestamp = function(date){
            if (date == "help") {
                console.log("/**\r\n  * @desc convert FairGarage date string to timestamp number\r\n  * @param {string} date - FairGarage date string, in the format YYYY-MM-01\r\n  * @return {number} timestamp\r\n*/\r\n");                return;
            }
            if (!/\d{4}\-\d{2}\-01/.test(date)) {
                return self.error('Please write the date in the format YYYY-MM-01, e.g. "2008-01-01"');
            }
            var year = date.split('-')[0];
            var month = parseInt(date.split('-')[1])-1;
            return (new Date(year,month)).getTime();
        }
        
        self.findAgreement = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find FairGarage agreements, API base path: /smp/api/agreements, API full path: /smp/api/agreements\r\n  * @param {object} pobj\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n      * @param {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects. The response can be directly used for the registration.\r\n            The structure of each object in parameter data:\r\n                providerId - ID of the providerId (1 for FairGarage)\r\n                agreementId - ID of the agreement\r\n                agreementVersionId - version ID of the agreement\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.checkLoginStatus = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc check login status, API base path: /smp/api/authentication/login, API full path: /smp/api/authentication/login\r\n  * @param {object} pobj\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.login = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc login, API base path: /smp/api/authentication/login, API full path: /smp/api/authentication/login\r\n  * @param {object} pobj\r\n      * @param {function(data)} newAgreements - to display the new agreements whenever there is an update of them, with parameter (data) of type object.\r\n            The structure of parameter data:\r\n                addedAgreements - array of objects, agreements to be added\r\n                    agreementId - string, ID of the corresponding agreement\r\n                    title - string, title of the corresponding agreement\r\n                    htmlText - string, html text of the corresponding agreement\r\n                updatedAgreements - array of objects, agreements to be updated\r\n                    agreementId - string, ID of the corresponding agreement\r\n                    title - string, title of the corresponding agreement\r\n                    htmlText - string, html text of the corresponding agreement\r\n                loginAgain - function, to login with new agreements\r\n      * @param {object} loginData - data of login; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} username - username\r\n          * @param {string} password - password\r\n          * @param {array of objects} agreementVersions (opt) - agreement versions\r\n                an agreement version is in the form {agreementId: 'agreementId'}\r\n      * @param {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type object.\r\n            The structure of parameter data:\r\n                authorities - array of strings, authorities of the user\r\n                emailAddress - string, email address of the user\r\n                givenname - string, given name of the user\r\n                middlename - string, middle name of the user\r\n                surname - string, surname of the user\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.logout = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc logout, API base path: /smp/api/authentication/logout, API full path: /smp/api/authentication/logout\r\n  * @param {object} pobj\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.createContext = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc create/post context, API base path: /smp/api/contexts, API full path: /smp/api/contexts\r\n  * @param {object} pobj\r\n      * @param {object} context - context config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.deleteContext = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc delete context, API base path: /smp/api/contexts, API full path: /smp/api/contexts/{key}\r\n  * @param {object} pobj\r\n      * @param {string} contextKey - context key\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findContext = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find context, API base path: /smp/api/contexts, API full path: /smp/api/contexts\r\n  * @param {object} pobj\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {number} limit (opt) (API url parameter) - limit\r\n          * @param {number} locationId (opt) (API url parameter) - location ID\r\n          * @param {number} offset (opt) (API url parameter) - offset\r\n          * @param {number} providerId (opt) (API url parameter) - provider ID\r\n          * @param {boolean} superseded (opt) (API url parameter) - superseded\r\n          * @param {string} webkitConfigKey (opt) (API url parameter) - webkit config key\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getContext = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get context, API base path: /smp/api/contexts, API full path: /smp/api/contexts/{key}\r\n  * @param {object} pobj\r\n      * @param {string} contextKey - context key\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.updateContext = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc update/put context, API base path: /smp/api/contexts, API full path: /smp/api/contexts/{key}\r\n  * @param {object} pobj\r\n      * @param {object} context - context config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findCountryConfig = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find country configuration, API base path: /smp/api/countryconfig, API full path: /smp/api/countryconfig\r\n  * @param {object} pobj\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} countryCode (opt) (API url parameter) - country code; \"DE\", \"GB\", \"PL\", or other country codes that can be found by function findCountryConfig()\r\n          * @param {string} orderBy (opt) (API url parameter) - order by\r\n          * @param {boolean} ascending (opt) (API url parameter) - in ascending order nor not\r\n          * @param {number} offset (opt) (API url parameter) - offset of the results\r\n          * @param {number} limit (opt) (API url parameter) - limit of the results\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getCurrentCountryConfig = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get country configuration of the current context, API base path: /smp/api/countryconfig/current, API full path: /smp/api/countryconfig/current\r\n  * @param {object} pobj\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findLocation = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find location, API base path: /smp/api/locations, API full path: /smp/api/locations\r\n  * @param {object} pobj\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} context (opt) (API url parameter) - context\r\n          * @param {string} limit (opt) (API url parameter) - number of results to show\r\n          * @param {string} offset (opt) (API url parameter) - offset of the results to show\r\n          * @param {string} providerId (opt) (API url parameter) - ID of the provider\r\n          * @param {string} radius (opt) (API url parameter) - search radius\r\n          * @param {string} regionSignature (opt) (API url parameter) - signature of the region\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getLocation = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get location, API base path: /smp/api/locations, API full path: /smp/api/locations/{locationId}\r\n  * @param {object} pobj\r\n      * @param {string} locationId - ID of the location; if not set, default value would be self.getProperty('locationId')\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.createMailConfig = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc create mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs\r\n  * @param {object} pobj\r\n      * @param {object} mailConfig - mail configuration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} countryCode - country code; \"DE\", \"GB\", \"PL\", or other country codes that can be found by function findCountryConfig()\r\n          * @param {string} languageCode - language code; \"de\", \"en\", \"pl\", or other language codes that can be found by function findCountryConfig()\r\n          * @param {string} name - name of the mail configuration\r\n          * @param {number} providerId - ID of the provider\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.createMailTemplate = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc create mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates\r\n  * @param {object} pobj\r\n      * @param {object} mailTemplate - mail template; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} mailConfigId - ID of the mail configuration\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.deleteAllMailTemplates = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc delete all mail templates, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates\r\n  * @param {object} pobj\r\n      * @param {string} mailConfigId - ID of the mail configuration\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.deleteMailConfig = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc delete mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{id}\r\n  * @param {object} pobj\r\n      * @param {string} mailConfigId - ID of the mail configuration\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.deleteMailTemplate = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc delete mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates/{templateId}\r\n  * @param {object} pobj\r\n      * @param {string} mailConfigId - ID of the mail configuration\r\n      * @param {string} templateId - ID of the mail template\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findMailConfig = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs\r\n  * @param {object} pobj\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} countryCode (opt) (API url parameter) - country code; \"DE\", \"GB\", \"PL\", or other country codes that can be found by function findCountryConfig()\r\n          * @param {boolean} isPublic (opt) (API url parameter) - whether the mail configuration is public or not\r\n          * @param {string} languageCode (opt) (API url parameter) - language code; \"de\", \"en\", \"pl\", or other language codes that can be found by function findCountryConfig()\r\n          * @param {string} name (opt) (API url parameter) - name of the mail configuration\r\n          * @param {number} providerId (opt) (API url parameter) - ID of the provider\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findMailTemplate = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates\r\n  * @param {object} pobj\r\n      * @param {object} criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} mailConfigId (API url parameter) - ID of the mail configuration\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getMailConfig = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{id}\r\n  * @param {object} pobj\r\n      * @param {string} mailConfigId - ID of the mail configuration\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getMailTemplate = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates/{templateId}\r\n  * @param {object} pobj\r\n      * @param {string} mailConfigId - ID of the mail configuration\r\n      * @param {string} templateId - ID of the mail template\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.updateMailConfig = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc update mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{id}\r\n  * @param {object} pobj\r\n      * @param {object} mailConfig - mail configuration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.updateMailTemplate = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc update mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates/{templateId}\r\n  * @param {object} pobj\r\n      * @param {object} mailTemplate - mail template; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} mailConfigId (API url parameter) - ID of the mail configuration\r\n          * @param {string} id (API url parameter) - ID of the mail template\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getOffer = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get offer by offer key, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerKey}\r\n  * @param {object} pobj\r\n      * @param {string} offerKey - offer key\r\n      * @param {object} criteria (opt) - criteria to show the offer; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getOfferEmail = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get email template, used to send the offer, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerKey}/mailcontent\r\n  * @param {object} pobj\r\n      * @param {string} offerKey - offer key\r\n      * @param {object} criteria (opt) - criteria to show the offer; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getOfferList = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get offer list, API base path: /smp/api/offers/list, API full path: /smp/api/offers/list/{offerSearchKey}\r\n  * @param {object} pobj\r\n      * @param {string} offerSearchKey - offer search key\r\n      * @param {object} criteria (opt) - criteria to show the results; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {number} limit (opt) (API url parameter) - number of results in list of offers\r\n          * @param {number} offset (opt) (API url parameter) - offset of results in list of offers\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getOfferTimeSlot = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get time slot for offer with offer key, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerKey}/timeslot\r\n  * @param {object} pobj\r\n      * @param {string} offerKey - offer key\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.sendOfferEmail = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc send the offer with the email template, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerKey}/mail\r\n  * @param {object} pobj\r\n      * @param {string} offerKey - offer key\r\n      * @param {object} offerMail - offer email; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.createOfferSearch = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc create offer search, API base path: /smp/api/offersearches, API full path: /smp/api/offersearches\r\n  * @param {object} pobj\r\n      * @param {object} offerSearch - use vehicle, region, and service to create an offer search; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {object} selectedVehicle - selected vehicle\r\n          * @param {array of objects} selectedServiceList - list of selected services\r\n          * @param {object} region (opt) - search offers in the given region\r\n      * @param {object} criteria (opt) - other search criteria\r\n          * @param {boolean} generateEmpty (opt) (API url parameter) - whether locations with no offer will be included in the result list\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getOfferSearch = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get offer search, API base path: /smp/api/offersearches, API full path: /smp/api/offersearches/{offerSearchKey}\r\n  * @param {object} pobj\r\n      * @param {string} offerSearchKey - offer search key\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getAllPartQualities = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get all part qualities, API base path: /smp/api/partqualities, API full path: /smp/api/partqualities\r\n  * @param {object} pobj\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findRegion = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find region, API base path: /smp/api/regions, API full path: /smp/api/regions\r\n  * @param {object} pobj\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} searchTerm (opt) (API url parameter) - search term\r\n      * @param {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects.\r\n            The structure of each object in parameter data:\r\n                formattedName - string, formatted name of the region\r\n                nearbyLocationCount - number, number of nearby locations\r\n                signature - string, region signature\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getRegionBySignature = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get region by region signature, API base path: /smp/api/regions/signature, API full path: /smp/api/regions/signature/{signature}\r\n  * @param {object} pobj\r\n      * @param {string} signature - region signature\r\n      * @param {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type object.\r\n            The structure of the parameter data:\r\n                formattedName - string, formatted name of the region\r\n                nearbyLocationCount - number, number of nearby locations\r\n                signature - string, region signature\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getRegionOfUser = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get region of the user, API base path: /smp/api/regions/default, API full path: /smp/api/regions/default\r\n  * @param {object} pobj\r\n      * @param {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type object.\r\n            The structure of the parameter data:\r\n                formattedName - string, formatted name of the region\r\n                nearbyLocationCount - number, number of nearby locations\r\n                signature - string, region signature\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findService = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find service, API base path: /smp/api/services/services, API full path: /smp/api/services/services\r\n  * @param {object} pobj\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} searchTerm (opt) (API url parameter) - search term, name of the service\r\n          * @param {string} vehicleTypeId (opt) (API url parameter) - ID of vehicle type\r\n          * @param {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the format \"YYYY-MM-01\"\r\n          * @param {number} numResults (opt) (API url parameter) - number of results\r\n      * @param {function} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects\r\n            The structure of each object in parameter data:\r\n                serviceId - number, ID of the service\r\n                serviceName - string, name of the service\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findServiceByCatalog = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find service by catalog, API base path: /smp/api/services/catalog, API full path: /smp/api/services/catalog/{serviceCategoryId}\r\n  * @param {object} pobj\r\n      * @param {string} serviceCategoryId - ID of service category\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the format \"YYYY-MM-01\"\r\n          * @param {string} vehicleTypeId (opt) (API url parameter) - ID of vehicle type\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findTopServiceForVehicle = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find top services for vehicle with ID of vehicle type, API base path: /smp/api/services/services/top, API full path: /smp/api/services/services/top/{vehicleTypeId}\r\n  * @param {object} pobj\r\n      * @param {string} vehicleTypeId - ID of vehicle type\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the format \"YYYY-MM-01\"\r\n          * @param {number} numResults (opt) (API url parameter) - number of results to show\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getAllInspectionServicePositions = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get all inspection service positions, API base path: /smp/api/services/servicepositions, API full path: /smp/api/services/servicepositions/{serviceId}/{vehicleTypeId}/{constructionTime}\r\n  * @param {object} pobj\r\n      * @param {string or number} vehicleTypeId - ID of vehicle type\r\n      * @param {string or number} serviceId - ID of the inspection service\r\n      * @param {string} constructionTime - construction time of the vehicle, in the format \"YYYY-MM-01\"\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} equipmentCodes (opt) (API url parameter) - equipment code of the vehicle\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getServiceById = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get service by service ID, API base path: /smp/api/services/services, API full path: /smp/api/services/services/{id}\r\n  * @param {object} pobj\r\n      * @param {string} serviceId - ID of service\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the format \"YYYY-MM-01\"\r\n          * @param {string} vehicleTypeId (opt) (API url parameter) - ID of vehicle type\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getServiceCategory = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get service category, API base path: /smp/api/services/servicecategories, API full path: /smp/api/services/servicecategories/{serviceCategoryId}\r\n  * @param {object} pobj\r\n      * @param {string} serviceCategoryId - ID of service category\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.registerUser = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc register as individual FairGarage user. If this step is successful, the user will receive an email concerning setting the password, to complete the registration, API base path: /smp/api/users, API full path: /smp/api/users\r\n  * @param {object} pobj\r\n      * @param {string} registrationData - data of registration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} salutation - salutation\r\n          * @param {string} givenname - given name\r\n          * @param {string} surname - surname\r\n          * @param {string} emailAddress - email address\r\n          * @param {array of objects, the agreement objects can be obtained by findAgreement} acceptedAgreements - accepted agreements\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.evaluateVehicle = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc evaluate a vehicle, API base path: /smp/api/vehicles/evaluation, API full path: /smp/api/vehicles/evaluation\r\n  * @param {object} pobj\r\n      * @param {object} valuatedVehicle - vehicle information for the evaluation\r\n          * @param {object} datVehicleContainer - vehicle information used for the DAT evaluation; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n                The minimum structure of this object datVehicleContainer:\r\n                    {object} vehicleType - vehicle type, the vehicle object returned by FairGarage API, by any searching method\r\n                    {object} registrationDate - registration date\r\n                        {number} time - registration date of the current vehicle, in timestamp\r\n                    {number} milage - milage of the vehicle, please indicate the value in kilometer (km)\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} languageCode (opt) (API url parameter) - language code; \"de\", \"en\", \"pl\", or other language codes that can be found by function findCountryConfig()\r\n          * @param {string} countryCode (opt) (API url parameter) - country code; \"DE\", \"GB\", \"PL\", or other country codes that can be found by function findCountryConfig()\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findVehicleByCatalog = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find vehicle by catalog, API base path: /smp/api/vehicles/catalog, API full path: /smp/api/vehicles/catalog/{vehicleCategoryId}\r\n  * @param {object} pobj\r\n      * @param {string} categoryId - vehicle category ID. To find IDs of the next category, start with \"62303\" (default) for SUV/passenger cars, or \"83503\" for transporters\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the format \"YYYY-MM-01\"\r\n      * @param {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects.\r\n            The structure of each object in the parameter data:\r\n                {boolean} lastLevel - if the last category level is reached\r\n                {number} id - ID of the category; or ID of the vehicle type (if the last level is reached)\r\n                {string} name - name of the category\r\n                {string} externalId - external ID or Ecode of the vehicle (if the last level is reached)\r\n                {array of objects} properties - each of which are objects of the vehicle (if the last level is reached)\r\n                    The structure of each property object:\r\n                        {string} name - name of the property\r\n                        {string} value - value of the property\r\n      * @param {boolean} saveVehicle (opt) - save the found vehicle, if only one vehicle is found, by setProperties into \"vehicle\"\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findVehicleByDocument = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find vehicle by documents, either externalId, or both hsn and tsn must be given in criteria, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes\r\n  * @param {object} pobj\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {string} externalId (opt) (API url parameter) - external ID or Ecode of the vehicle\r\n          * @param {string} hsn (opt) (API url parameter) - HSN of the vehicle\r\n          * @param {string} tsn (opt) (API url parameter) - TSN of the vehicle\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findVehicleByExternalId = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find vehicle by the external ID of the vehicle, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes\r\n  * @param {object} pobj\r\n      * @param {string} externalId - external ID or Ecode of the vehicle\r\n      * @param {boolean} saveVehicle (opt) - save the found vehicle, if only one vehicle is found, by setProperties into \"vehicle\"\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findVehicleByHSNTSN = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find vehicle by HSN/TSN of the vehicle, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes\r\n  * @param {object} pobj\r\n      * @param {string} hsn - HSN of the vehicle\r\n      * @param {string} tsn - TSN of the vehicle\r\n      * @param {boolean} saveVehicle (opt) - save the found vehicle, if only one vehicle is found, by setProperties into \"vehicle\"\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findVehicleEquipment = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find vehicle equipment, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes/{id}/equipments\r\n  * @param {object} pobj\r\n      * @param {string} vehicleTypeId - ID of vehicle type\r\n      * @param {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects.\r\n            The structure of each object in parameter data:\r\n                \r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findVehicleEquipmentForService = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find vehicle equipment for selected service, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes/{id}/equipments/{serviceId}/{constructionTime}\r\n  * @param {object} pobj\r\n      * @param {string} vehicleTypeId - ID of vehicle type\r\n      * @param {string} serviceId - ID of the service\r\n      * @param {string} constructionTime - construction time of the vehicle, in the format \"YYYY-MM-01\"\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getVehicleByVehicleTypeId = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get vehicle by vehicle type ID, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes/{id}\r\n  * @param {object} pobj\r\n      * @param {string} vehicleTypeId - ID of vehicle type\r\n      * @param {boolean} saveVehicle (opt) - save the found vehicle, if only one vehicle is found, by setProperties into \"vehicle\"\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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
                        selectedVehicle.constructionTime.time = self.dateToTimestamp(year + '-' + (data.constructionTimeMap[year].sort(function(a,b){return a-b})[0]));
                        self.setProperties({selectedVehicle:selectedVehicle});
                    }
                    if (typeof success == 'function') {success(data);}
                },
                functionName: 'getVehicleByVehicleTypeId()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        self.createWebkitConfig = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc create webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs\r\n  * @param {object} pobj\r\n      * @param {object} webkitConfig - webkit config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.deleteWebkitConfig = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc delete webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs/{key}\r\n  * @param {object} pobj\r\n      * @param {string} webkitConfigKey - webkit config key\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.findWebkitConfig = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc find webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs\r\n  * @param {object} pobj\r\n      * @param {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n          * @param {number} limit (opt) (API url parameter) - limit\r\n          * @param {number} offset (opt) (API url parameter) - offset\r\n          * @param {number} providerId (opt) (API url parameter) - provider ID\r\n          * @param {boolean} superseded (opt) (API url parameter) - superseded\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.getWebkitConfig = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc get webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs/{key}\r\n  * @param {object} pobj\r\n      * @param {string} webkitConfigKey - webkit config key\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        self.updateWebkitConfig = function(pobj){
            if (pobj == "help") {
                console.log("/** \r\n  * @desc update/put webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs/{key}\r\n  * @param {object} pobj\r\n      * @param {object} webkitConfig - webkit config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/\r\n      * @param {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed\r\n*/\r\n");                return;
            }
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

        if (fgObj == "help") {
            var functions = 'Available functions in FairGarage API library:\r\n';
            for (var key in self) {
                if (typeof self[key] == 'function'){;
                    functions += (key.toString() + '()\r\n');
                }
            };
            return console.log(functions);
        }
        return self;
    }
    
})(jQuery);