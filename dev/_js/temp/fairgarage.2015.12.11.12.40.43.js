
(function($){

    var console = window.console || {};
    console.error = window.console.error || function(){};

    window.fg = function(fgObj){
        var self = {};
        var varPrivate = {};

        self.properties = {
            ssl: 'https',
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
              * @key {string} ssl - 'https' (default) or 'http'
              * @key {object} selectedVehicle - the vehicle object used in FairGarage API. It has 3 keys:
                    @key {object} constructionTime: the construction time object has one key, 'time', which stores the timestamp of the construction time of the vehicle. The value could be automatically saved, if saveVehicle in the corresponding functions is set to true.
                    @key {array of objects} equipmentList: each object of the list is a FairGarage equipment object
                    @key {object} vehicleType: the FairGarage vehicle object
        */
        self.setProperties = function(newProperties){
            $.extend(self.properties,newProperties);
        };
        self.setProperties(fgObj);

        /**
          * @desc get property in self.properties
          * @param {string} propertyName - object with new properties to be added/modified
          * @return the value of the property, otherwise null, if propertyName not defined
        */
        self.getProperty = function(propertyName){
            return self.properties[propertyName];
        };

        /**
          * @desc remove properties in self.properties
          * @param {array of strings} properties - array with names of properties to be added/modified in self.properties
        */
        self.removeProperties = function(properties){
            $.each(properties,function(){
                delete self.properties[this.toString()];
            });
        };

        /**
          * @desc ajax request
          * @param {object} obj - obj for jQuery ajax() function,
                                    except modifications in "url", "error"
        */
        self.api = function(obj){
            var functionName = obj.functionName || 'api()';
            var type = obj.type || 'GET';
            var urlParam = obj.urlParam || {};
            var url = (($.inArray(self.getProperty('ssl'),['http','https']) >= 0) ? self.getProperty('ssl') : 'https') + '://' + self.getProperty('env') + self.getProperty('apiBase') + (obj.apiUrl || 'authentication/current') + (varPrivate.sessionId ? ';jsessionid=' + varPrivate.sessionId : '') + ('?' + $.param($.extend({contextKey:self.getProperty('contextKey')},urlParam)));
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
                crossDomain: true,
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
        };

        /**
          * @desc get first construction time of the vehicle in FairGarage date format to timestamp number
          * @param {object} constructionTimeMap - vehicle construction time map in FairGarage format
          * @return {string} FairGarage date, YYYY-MM-01
        */
        self.getFirstDateInConstructionTimeMap = function(constructionTimeMap){
            var years = [];
            for (var year in constructionTimeMap) {
                years.push(year);
            }
            var thisYear = years.sort()[0];
            return (thisYear + '-' + ('0' + constructionTimeMap[thisYear].sort(function(a,b){return a-b;})[0]).slice(-2) + '-01');
        };

        /**
          * @desc convert FairGarage date string to timestamp number
          * @param {string} date - FairGarage date string, in the format YYYY-MM-01
          * @return {number} timestamp
        */
        self.dateToTimestamp = function(date){
            if (!(/\d{4}\-\d{2}\-01/.test(date) || /\d{4}\-\d{1}\-01/.test(date))) {
                return self.error('Please write the date in the format YYYY-MM-01, e.g. "2008-01-01"');
            }
            var year = date.split('-')[0];
            var month = parseInt(date.split('-')[1])-1;
            return (new Date(year,month)).getTime();
        };

        /**
          * @desc convert timestamp number to FairGarage date string
          * @param {number} timestamp
          * @return {string} date - FairGarage date string, in the format YYYY-MM-01
        */
        self.timestampToDate = function(timestamp){
            var time = new Date(timestamp);
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            var date = year + '-' + ('0' + month).slice(-2) + '-01';
            return date;
        };

        /**
          * @desc convert timestamp number to FairGarage date string
          * @param {array} paramConfigs - configuration objects for each parameter. The structure for each object:
              * @param {string} paramName - name of the parameter
              * @param {string} paramType - javascript type of the parameter
              * @param {string} (opt) parentObj - if this mandatory parameter is a key of a mandatory object, indicate the 'parent' object here
              * @param (opt) defaultValue - default value of the parameter
          * @return {string} boolean - whether all mandatory parameters are set or not
        */
        self.areMandatoryParmsSet = function(functionName,pobj,paramConfigs){
            var missingMandatoryParams = [];
            $.each(paramConfigs,function(i,config){
                var paramName = config.paramName;//string
                var paramType = config.paramType;//string
                var parentObj = config.parentObj;//string
                var defaultValue = config.defaultValue;
                var isMissing = false;
                if (typeof pobj[parentObj] === 'undefined') {// this is the parent object
                    if (typeof pobj[paramName] === 'undefined') {// this parameter is not given
                        if (typeof defaultValue !== 'undefined') {// default value is given
                            pobj[paramName] = defaultValue;
                        } else {// default value is not given
                            if (paramType === 'object') {// set empty object, such that its mandatory fields would be indicated
                                pobj[paramName] = {};
                            }
                            isMissing = true;
                        }
                    }
                } else {// this is a field of the parent object
                    if (typeof pobj[parentObj][paramName] === 'undefined') {// this parameter is not given
                        if (typeof defaultValue !== 'undefined') {// default value is given
                            pobj[paramName] = defaultValue;
                        } else {// default value is not given
                            isMissing = true;
                        }
                    }

                }
                if (isMissing) {
                    missingMandatoryParams.push('"' + paramName + '" of type "' + paramType + '"' + (typeof parentObj === 'undefined' ? '' : ' in "' + parentObj + '"' ));
                }
            });
            if (missingMandatoryParams.length > 0) {
                self.error('Please indicate in function ' + functionName + '(): ' + missingMandatoryParams.join(', '));
                return [false,pobj];
            } else {
                return [true,pobj];
            }
        };

        /**
          * @desc login for admin user, API base path: /smp/api/authentication/login/admin, API full path: /smp/api/authentication/login/admin
          * @param {object} pobj
              * @key {object} loginData - data of login
                  * @key {string} username - username
                  * @key {string} password - password
                  * @key {string or number} locationId (opt) - ID of location
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.adminUserLogin = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
// check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'loginData',
                    paramType: 'object'
                },{
                    paramName: 'username',
                    paramType: 'string',
                    parentObj: 'loginData'
                },{
                    paramName: 'password',
                    paramType: 'string',
                    parentObj: 'loginData'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet('adminUserLogin',pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
// check mandatory fields end
            var loginData = pobj.loginData;
            var success = ajax.success;
            var obj = {
                apiUrl: 'authentication/login/admin',
                data: JSON.stringify(loginData),
                type: 'POST',
                success: function(data){
                    varPrivate.sessionId = data.user.sessionId;
                    if (typeof success == 'function') {success(data);}
                },
                functionName: 'adminUserLogin()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        };

        /**
          * @desc check login status, API base path: /smp/api/authentication/current, API full path: /smp/api/authentication/current
          * @param {object} pobj
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.checkLoginStatus = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var success = ajax.success;
            var error = ajax.error;
            var obj = {
                apiUrl: 'authentication/current',
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
        };

        /**
          * @desc login for location user, please use your DAT login, or your FairGarage login and your location ID, or with token, API base path: /smp/api/authentication/login/locationuser, API full path: /smp/api/authentication/login/locationuser
          * @param {object} pobj
              * @key {object} loginData - data of login; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} username - username, if not set, default value would be ''
                  * @key {string} password - password, if not set, default value would be ''
                  * @key {string or number} datCustomerNumber - DAT customer number, if not set, default value would be ''
                  * @key {string} authToken - authentication token, if not set, default value would be ''
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.locationUserLogin = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
// check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'loginData',
                    paramType: 'object'
                },{
                    paramName: 'username',
                    paramType: 'string',
                    defaultValue: '',
                    parentObj: 'loginData'
                },{
                    paramName: 'password',
                    paramType: 'string',
                    defaultValue: '',
                    parentObj: 'loginData'
                },{
                    paramName: 'datCustomerNumber',
                    paramType: 'string or number',
                    defaultValue: '',
                    parentObj: 'loginData'
                },{
                    paramName: 'authToken',
                    paramType: 'string',
                    defaultValue: '',
                    parentObj: 'loginData'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet('locationUserLogin',pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
// check mandatory fields end
            var loginData = pobj.loginData;
            var success = ajax.success;
            var obj = {
                apiUrl: 'authentication/login/locationuser',
                data: JSON.stringify(loginData),
                type: 'POST',
                success: function(data){
                    varPrivate.sessionId = data.user.sessionId;
                    if (typeof success == 'function') {success(data);}
                },
                functionName: 'locationUserLogin()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        };

        /**
          * @desc logout, API base path: /smp/api/authentication/current, API full path: /smp/api/authentication/current
          * @param {object} pobj
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.logout = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var complete = ajax.complete;
            var obj = {
                type: 'DELETE',
                apiUrl: 'authentication/current',
                complete: function(jqXHR,textStatus){
    	            delete varPrivate.sessionId;
    	            if (typeof complete == 'function') {complete(jqXHR,textStatus);}
                },
                functionName: 'logout()'
            };
            delete ajax.complete;
            self.api($.extend(obj,ajax));
        };

        /**
          * @desc login for web customer, API base path: /smp/api/authentication/login/webuser, API full path: /smp/api/authentication/login/webuser
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
        self.webUserLogin = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
// check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'newAgreements',
                    paramType: 'function(data)'
                },{
                    paramName: 'loginData',
                    paramType: 'object'
                },{
                    paramName: 'username',
                    paramType: 'string',
                    parentObj: 'loginData'
                },{
                    paramName: 'password',
                    paramType: 'string',
                    parentObj: 'loginData'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet('webUserLogin',pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
// check mandatory fields end
            var newAgreements = pobj.newAgreements;
            var loginData = pobj.loginData;
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var complete = ajax.complete;
            varPrivate.loginArguments = arguments[0];
            var obj = {
                apiUrl: 'authentication/login/webuser',
                data: JSON.stringify(loginData),
                type: 'POST',
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
                                self.error('Please use the login() function to retry your authentication.');
                            }
                        };
                        newData.loginAgain = function(){
                            self.loginAgain();
                        };

                        newAgreements(newData);
                        return;
                    } else {
                        delete varPrivate.loginArguments;
                    }
                    if (typeof complete == 'function') {complete(jqXHR,textStatus);}
                },
                functionName: 'webUserLogin()'
            };
            delete ajax.success;
            delete ajax.complete;
            self.api($.extend(obj,ajax));
        };

        return self;
    };

})(jQuery);