
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

        // fake lodash/underscore library
        var helper = (function(){

            var optimizeCb = function(func, context, argCount) {
                if (context === void 0) return func;
                switch (argCount === null ? 3 : argCount) {
                    case 1: return function(value) {
                        return func.call(context, value);
                    };
                    case 2: return function(value, other) {
                        return func.call(context, value, other);
                    };
                    case 3: return function(value, index, collection) {
                        return func.call(context, value, index, collection);
                    };
                    case 4: return function(accumulator, value, index, collection) {
                        return func.call(context, accumulator, value, index, collection);
                    };
                }
                return function() {
                    return func.apply(context, arguments);
                };
            };

            var nativeKeys = Object.keys;
            var nativeIsArray = Array.isArray;

            var ObjProto = Object.prototype;

            var toString = ObjProto.toString;

            var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
            var nonEnumerableProps = [
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'toLocaleString',
                'toString',
                'valueOf'
            ];

            var createAssigner = function(keysFunc, undefinedOnly) {
                return function(obj) {
                    var length = arguments.length;
                    if (length < 2 || obj === null) {return obj;}
                    for (var index = 1; index < length; index++) {
                        var source = arguments[index],
                            keys = keysFunc(source),
                            l = keys.length;
                        for (var i = 0; i < l; i++) {
                            var key = keys[i];
                            if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                        }
                    }
                    return obj;
                };
            };

            var property = function(key) {
                return function(obj) {
                    return obj === null ? void 0 : obj[key];
                };
            };
            var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
            var getLength = property('length');
            var isArrayLike = function(collection) {
                var length = getLength(collection);
                return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
            };

            function collectNonEnumProps(obj, keys) {
                var nonEnumIdx = nonEnumerableProps.length;
                var constructor = obj.constructor;
                var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

                var prop = 'constructor';
                if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

                while (nonEnumIdx--) {
                    prop = nonEnumerableProps[nonEnumIdx];
                    if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                        keys.push(prop);
                    }
                }
            }

            var _ = {};

            _.assign = createAssigner(_.keys);

            _.clone = function(obj) {
                if (!_.isObject(obj)) return obj;
                return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
            };

            _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
                if (!isArrayLike(obj)) {
                    obj = _.values(obj);
                }
                if (typeof fromIndex != 'number' || guard) {
                    fromIndex = 0;
                }

                return _.indexOf(obj, item, fromIndex) >= 0;
            };

            _.each = _.forEach = function(obj, iteratee, context) {
                iteratee = optimizeCb(iteratee, context);
                var i, length;
                if (isArrayLike(obj)) {
                    for (i = 0, length = obj.length; i < length; i++) {
                        iteratee(obj[i], i, obj);
                    }
                } else {
                    var keys = _.keys(obj);
                    for (i = 0, length = keys.length; i < length; i++) {
                        iteratee(obj[keys[i]], keys[i], obj);
                    }
                }
                return obj;
            };

            _.extend = createAssigner(_.allKeys);

            _.has = function(obj, key) {
                return obj !== null && hasOwnProperty.call(obj, key);
            };

            _.isArray = nativeIsArray || function(obj) {
                return toString.call(obj) === '[object Array]';
            };

            if (typeof /./ != 'function' && typeof Int8Array != 'object') {
                _.isFunction = function(obj) {
                    return typeof obj == 'function' || false;
                };
            }

            _.isObject = function(obj) {
                var type = typeof obj;
                return type === 'function' || type === 'object' && !!obj;
            };

            _.keys = function(obj) {
                if (!_.isObject(obj)) return [];
                if (nativeKeys) return nativeKeys(obj);
                var keys = [];
                for (var key in obj) if (_.has(obj, key)) keys.push(key);
                if (hasEnumBug) collectNonEnumProps(obj, keys);
                return keys;
            };

            return _;

        })();


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
            extend(self.properties,newProperties);
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
            helper.each(properties,function(property){
                delete self.properties[property];
            });
        };

        /**
          * @desc ajax request
          * @param {object} obj - obj for jQuery ajax() function,
                                    except modifications in "url", "error"
        */
        self.api = function(obj){
            var functionName = obj.functionName || 'api';
            var type = obj.type || 'GET';
            var urlParam = obj.urlParam || {};
            var url = (($.inArray(self.getProperty('ssl'),['http','https']) >= 0) ? self.getProperty('ssl') : 'https') + '://' + self.getProperty('env') + self.getProperty('apiBase') + (obj.apiUrl || 'authentication/current') + (varPrivate.sessionId ? ';jsessionid=' + varPrivate.sessionId : '') + ('?' + $.param(extend({contextKey:self.getProperty('contextKey')},urlParam)));
            //var forceNoSession = obj.forceNoSession ? true : false;
            //url = forceNoSession ? url : appendSession(url);
            var error = obj.error || function(jqXHR,textStatus,errorThrown){
                try {
                    var errMsg = [];
                    helper.each(jqXHR.responseJSON,function(response){
                        var temp;
                        if (response.field) {
                            temp = response.field.split('.')[1] || response.field.split('.')[0] + ' of the payload' + (response.errorMessage ? ', ' + response.errorMessage : ' error');
                        } else {
                            temp = response.errorMessage;
                        }
                        errMsg.push(temp);
                    });
                    self.error('Network Error: ' + textStatus + ', ' + errorThrown + '. ' + errMsg.join('; '));
                } catch (err) {
                    self.error('Error in FairGarage API when trying to use function ' + functionName + '()');
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

            ajaxObj = extend(obj,ajaxObj);

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
          * @desc check whether given variable has given type
          * @param variable - variable to be analysed
          * @param {string} expectedType - expected type of the variable
          * @return {boolean} given variable is of expected type or not
        */
        function isType(variable, expectedType){
            return typeof(variable) === expectedType;
        }

        /**
          * @desc private extend function
          * @param {object} target - object to be extended
          * @param {object} object - properties of this object would be merged in
          * @param {boolean} deep - extend deep or not; default value true
        */
        function extend(target, object, deep){
            if (!isType(deep,'boolean')) {
                return $.extend(true, target, object);
            } else {
                return $.extend(deep, target, object);
            }
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
            }
            var thisYear = years.sort()[0];
            return (thisYear + '-' + ('0' + constructionTimeMap[thisYear].sort(function(a,b){return a-b;})[0]).slice(-2) + '-01');
        };

        /**
          * @desc convert FairGarage date string to UTC timestamp number
          * @param {string} date - FairGarage date string, in the format YYYY-MM-01
          * @return {number} timestamp
        */
        self.dateToTimestamp = function(date){
            if (!(/\d{4}\-\d{2}\-01/.test(date) || /\d{4}\-\d{1}\-01/.test(date))) {
                return self.error('Please write the date in the format YYYY-MM-01, e.g. "2008-01-01"');
            }
            var year = date.split('-')[0];
            var month = parseInt(date.split('-')[1])-1;
            //return (new Date(year,month)).getTime();
            return Date.UTC([year,month]);
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

        /** areMandatoryParmsSet
          * @desc check if given mandatory parameters are set correctly
          * @param {array} paramConfigs - configuration objects for each parameter. The structure for each object:
              * @param {string} paramName - name of the parameter
              * @param {string} paramType - javascript type of the parameter
              * @param {string} (opt) parentObj - if this mandatory parameter is a key of a mandatory object, indicate the 'parent' object here
              * @param (opt) defaultValue - default value of the parameter
          * @return {string} boolean - whether all mandatory parameters are set or not
        */
        self.areMandatoryParmsSet = function(functionName,pobj,paramConfigs){
            var missingMandatoryParams = [];
            helper.each(paramConfigs,function(config, i){
                var paramName = config.paramName;//string
                var paramType = config.paramType;//string
                var parentObj = config.parentObj;//string
                var defaultValue = config.defaultValue;
                var isMissing = false;
                if (isType(pobj[parentObj],'undefined')) {// this is the parent object
                    if (isType(pobj[paramName],'undefined')) {// this parameter is not given
                        if (!isType(defaultValue,'undefined')) {// default value is given
                            pobj[paramName] = defaultValue;
                        } else {// default value is not given
                            if (paramType === 'object') {// set empty object, such that its mandatory fields would be indicated
                                pobj[paramName] = {};
                            }
                            isMissing = true;
                        }
                    }
                } else {// this is a field of the parent object
                    if (isType(pobj[parentObj][paramName],'undefined')) {// this parameter is not given
                        if (!isType(defaultValue,'undefined')) {// default value is given
                            pobj[paramName] = defaultValue;
                        } else {// default value is not given
                            isMissing = true;
                        }
                    }

                }
                if (isMissing) {
                    missingMandatoryParams.push('"' + paramName + '" of type "' + paramType + '"' + (isType(parentObj,'undefined') ? '' : ' in "' + parentObj + '"' ));
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
          * @desc find FairGarage agreements, API base path: /smp/api/agreements, API full path: /smp/api/agreements
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {function(data)} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects. The response can be directly used for the registration.
                    The structure of each object in parameter data:
                        locationId - ID of location
                        agreementId - ID of the agreement
                        context - context key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findAgreement = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findAgreement';
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var obj = {
                apiUrl: 'agreements',
                urlParam: extend({context:self.getProperty('contextKey')},criteria),
                success: function(data){
                    if (isType(quickHandle,'function')) {
                        var newData = [];
                        helper.each(data,function(agreement){
                            newData.push({
                                agreementId: agreement.agreementId,
                                agreementVersionId: agreement.id
                            });
                        });
                        quickHandle(newData);
                    }
                    if (isType(success,'function')) {success(data);}
                },
                functionName: functionName
            };
            delete ajax.success;
            self.api(extend(obj,ajax));
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
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'adminUserLogin';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
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
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var loginData = pobj.loginData;
            var success = ajax.success;
            var obj = {
                type: 'POST',
                apiUrl: 'authentication/login/admin',
                data: JSON.stringify(loginData),
                success: function(data){
                    varPrivate.sessionId = data.sessionId;
                    if (isType(success,'function')) {success(data);}
                },
                functionName: functionName
            };
            delete ajax.success;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc check login status, API base path: /smp/api/authentication/current, API full path: /smp/api/authentication/current
          * @param {object} pobj
              * @key {function()} isLoggedIn (opt) - function to excecute if user is logged in
              * @key {function()} isNotLoggedIn (opt) - function to excecute if user is not logged in or session expired
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.checkLoginStatus = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'checkLoginStatus';
            var ajax = pobj.ajax || {};
            var isLoggedIn = pobj.isLoggedIn;
            var isNotLoggedIn = pobj.isNotLoggedIn;
            var success = ajax.success;
            var error = ajax.error;
            var obj = {
                apiUrl: 'authentication/current',
                success: function(data){
                    if (data.sessionId) {
                        varPrivate.sessionId = data.sessionId;
                        if (isType(isLoggedIn,'function')) {
                            isLoggedIn();
                        }
                    } else {
                        delete varPrivate.sessionId;
                        if (isType(isNotLoggedIn,'function')) {
                            isNotLoggedIn();
                        }
                    }
                    if (isType(success,'function')) {success(data);}
                },
                error: function(jqXHR,textStatus,errorThrown){
                    delete varPrivate.sessionId;
                    if (isType(isNotLoggedIn,'function')) {
                        isNotLoggedIn();
                    }
                    if (isType(error,'function')) {error(jqXHR,textStatus,errorThrown);}
                },
                functionName: functionName
            };
            delete ajax.success;
            delete ajax.error;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc check session, API base path: /smp/api/authentication/current_session, API full path: /smp/api/authentication/current_session
          * @param {object} pobj
              * @key {function()} isSessionNotExpired (opt) - function to excecute if user is logged in
              * @key {function()} isSessionExpired (opt) - function to excecute if user is not logged in or session expired
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.checkSession = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'checkSession';
            var ajax = pobj.ajax || {};
            var isSessionNotExpired = pobj.isSessionNotExpired;
            var isSessionExpired = pobj.isSessionExpired;
            var success = ajax.success;
            var error = ajax.error;
            var obj = {
                apiUrl: 'authentication/current_session',
                success: function(data){
                    if (data && data.sessionId) {
                        varPrivate.sessionId = data.sessionId;
                        if (isType(isSessionNotExpired,'function')) {
                            isSessionNotExpired();
                        }
                    } else {
                        delete varPrivate.sessionId;
                        if (isType(isSessionExpired,'function')) {
                            isSessionExpired();
                        }
                    }
                    if (isType(success,'function')) {success(data);}
                },
                error: function(jqXHR,textStatus,errorThrown){
                    delete varPrivate.sessionId;
                    if (isType(isSessionExpired,'function')) {
                        isSessionExpired();
                    }
                    if (isType(error,'function')) {error(jqXHR,textStatus,errorThrown);}
                },
                functionName: functionName
            };
            delete ajax.success;
            delete ajax.error;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc is password required for the web user, API base path: /smp/api/authentication/login/webuser, API full path: /smp/api/authentication/login/webuser
          * @param {object} pobj
              * @key {object} criteria - search criteria
                  * @key {string} username (API url parameter) - username, or email address of the web user
              * @key {function} isWebUserRegistered (opt) - function to excecute, if password is required. Is is suggested to ask the user to login in this case
              * @key {function} isWebUserNotRegistered (opt) - function to excecute, if password is not required
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.isWebUserRegistered = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'isWebUserRegistered';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'criteria',
                    paramType: 'object'
                },{
                    paramName: 'username',
                    paramType: 'string',
                    parentObj: 'criteria'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var criteria = pobj.criteria;
            var isWebUserRegistered = pobj.isWebUserRegistered;
            var isWebUserNotRegistered = pobj.isWebUserNotRegistered;
            var success = ajax.success;
            var obj = {
                apiUrl: 'authentication/login/webuser',
                urlParam: criteria,
                success: function(data){
                    if (data && data.requirePassword) {
                        if (isType(isWebUserRegistered,'function')) {
                            isWebUserRegistered();
                        }
                    } else {
                        if (isType(isWebUserNotRegistered,'function')) {
                            isWebUserNotRegistered();
                        }
                    }
                    if (isType(success,'function')) {success(data);}
                },
                functionName: functionName
            };
            delete ajax.success;
            self.api(extend(obj,ajax));
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
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'locationUserLogin';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
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
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var loginData = pobj.loginData;
            var success = ajax.success;
            var obj = {
                type: 'POST',
                apiUrl: 'authentication/login/locationuser',
                data: JSON.stringify(loginData),
                success: function(data){
                    varPrivate.sessionId = data.sessionId;
                    if (isType(success,'function')) {success(data);}
                },
                functionName: functionName
            };
            delete ajax.success;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc logout, API base path: /smp/api/authentication/current, API full path: /smp/api/authentication/current
          * @param {object} pobj
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.logout = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'logout';
            var ajax = pobj.ajax || {};
            var complete = ajax.complete;
            var obj = {
                type: 'DELETE',
                apiUrl: 'authentication/current',
                complete: function(jqXHR,textStatus){
    	            delete varPrivate.sessionId;
    	            if (isType(complete,'function')) {complete(jqXHR,textStatus);}
                },
                functionName: functionName
            };
            delete ajax.complete;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc request reset password, API base path: /smp/api/authentication/resetpassword, API full path: /smp/api/authentication/resetpassword
          * @param {object} pobj
              * @key {object} userData - data to send for requesting reset password
                  * @key {string} username - user name, or email address of the web user
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.requestResetPassword = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'requestResetPassword';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'userData',
                    paramType: 'object'
                },{
                    paramName: 'username',
                    paramType: 'string',
                    parentObj: 'userData'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var userData = pobj.userData;
            var obj = {
                type: 'POST',
                apiUrl: 'authentication/resetpassword',
                data: JSON.stringify(userData),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc reset password, API base path: /smp/api/authentication/resetpassword, API full path: /smp/api/authentication/resetpassword
          * @param {object} pobj
              * @key {object} passwordData - data to send for resetting password
                  * @key {string} username - user name, or email address of the web user
                  * @key {string} oldPassword - old password
                  * @key {string} newPassword - new password
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.resetPassword = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'resetPassword';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'passwordData',
                    paramType: 'object'
                },{
                    paramName: 'username',
                    paramType: 'string',
                    parentObj: 'passwordData'
                },{
                    paramName: 'oldPassword',
                    paramType: 'string',
                    parentObj: 'passwordData'
                },{
                    paramName: 'newPassword',
                    paramType: 'string',
                    parentObj: 'passwordData'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var passwordData = pobj.passwordData;
            var obj = {
                type: 'POST',
                apiUrl: 'authentication/resetpassword',
                data: JSON.stringify(passwordData),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc set password, API base path: /smp/api/authentication/resetpassword, API full path: /smp/api/authentication/resetpassword
          * @param {object} pobj
              * @key {object} passwordData - data to send for setting password
                  * @key {string} username - user name, or email address of the web user
                  * @key {string} token - token for setting password
                  * @key {string} newPassword - new password
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.setPassword = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'setPassword';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'passwordData',
                    paramType: 'object'
                },{
                    paramName: 'username',
                    paramType: 'string',
                    parentObj: 'passwordData'
                },{
                    paramName: 'token',
                    paramType: 'string',
                    parentObj: 'passwordData'
                },{
                    paramName: 'newPassword',
                    paramType: 'string',
                    parentObj: 'passwordData'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var passwordData = pobj.passwordData;
            var obj = {
                type: 'POST',
                apiUrl: 'authentication/resetpassword',
                data: JSON.stringify(passwordData),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
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
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'webUserLogin';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
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
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var newAgreements = pobj.newAgreements;
            var loginData = pobj.loginData;
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var complete = ajax.complete;
            varPrivate.loginArguments = arguments[0];
            var obj = {
                type: 'POST',
                apiUrl: 'authentication/login/webuser',
                data: JSON.stringify(loginData),
                success: function(data){
                    varPrivate.sessionId = data.sessionId;

                    if (isType(quickHandle,'function')) {
                        var newData = {
                            authorities: [],
                            emailAddress: data.user.emailAddress,
                            givenname: data.user.givenname,
                            middlename: data.user.middlename,
                            surname: data.user.surname
                        };
                        helper.each(data.user.authorities,function(authority){
                            newData.authorities.push(authority.authority);
                        });
                        quickHandle(newData);
                    }
                    if (isType(success,'function')) {success(data);}
                },
                complete: function(jqXHR,textStatus){
                    var data = jqXHR.responseJSON;
                    if (textStatus === 'error' && data.all) {// treat new agreements
                        var newData = {
                            addedAgreements: [],
                            updatedAgreements: []
                        };
                        var agreementVersions = [];
                        helper.each(data.agreementVersionsAdded,function(agreement){
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
                        helper.each(data.agreementVersionsUpdated,function(agreement){
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
                    if (isType(complete,'function')) {complete(jqXHR,textStatus);}
                },
                functionName: functionName
            };
            delete ajax.success;
            delete ajax.complete;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc create booking for web user, API base path: /smp/api/bookings, API full path: /smp/api/bookings
          * @param {object} pobj
              * @key {object} bookingData - data of booking to be passed
                  * @key {string} offerKey - key of the offer to be booked
                  * @key {string} givenname - given name of the customer
                  * @key {string} surname - surname of the customer
                  * @key {string} emailAddress - email address of the customer
                  * @key {string} phone - phone number of the customer
                  * @key {string or number} dropoffFrom - time stamp, to indicate drop off from which time
                  * @key {string or number} dropoffTo - time stamp, to indicate drop off to which time
                  * @key {string or number} mileage (opt) - mileage of the vehicle
                  * @key {string} licenseNumber (opt) - license number of the vehicle
              * @key {object} criteria (opt) - data of booking to be passed, like additional services, and part qualities
                  * @key {string} additionalServiceConfig (opt) (API url parameter) - service ID of additional service
                  * @key {string} partQualityConfig (opt) (API url parameter) - part quality type ID of the offer
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createBooking = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'createBooking';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'bookingData',
                    paramType: 'object'
                },{
                    paramName: 'offerKey',
                    paramType: 'string',
                    parentObj: 'bookingData'
                },{
                    paramName: 'givenname',
                    paramType: 'string',
                    parentObj: 'bookingData'
                },{
                    paramName: 'surname',
                    paramType: 'string',
                    parentObj: 'bookingData'
                },{
                    paramName: 'emailAddress',
                    paramType: 'string',
                    parentObj: 'bookingData'
                },{
                    paramName: 'phone',
                    paramType: 'string',
                    parentObj: 'bookingData'
                },{
                    paramName: 'dropoffFrom',
                    paramType: 'string or number',
                    parentObj: 'bookingData'
                },{
                    paramName: 'dropoffTo',
                    paramType: 'string or number',
                    parentObj: 'bookingData'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var bookingData = pobj.bookingData;
            var criteria = pobj.criteria;
            var obj = {
                type: 'POST',
                apiUrl: 'bookings',
                data: JSON.stringify(bookingData),
                urlParam: helper.assign(criteria,{status:{name:'BOOKED'}}),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc create booking voting by web user, API base path: /smp/api/bookings, API full path: /smp/api/bookings/{bookedOfferKey}/voting
          * @param {object} pobj
              * @key {string} bookedOfferKey - booked offer key
              * @key {object} votingData - voting data; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createBookingVoting = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'createBookingVoting';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'bookedOfferKey',
                    paramType: 'string'
                },{
                    paramName: 'votingData',
                    paramType: 'object'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var bookedOfferKey = pobj.bookedOfferKey;
            var votingData = pobj.votingData;
            var obj = {
                type: 'POST',
                apiUrl: 'bookings/' + bookedOfferKey + '/voting',
                data: JSON.stringify(votingData),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc create booking history by web user, API base path: /smp/api/bookings, API full path: /smp/api/bookings/{bookedOfferKey}/history
          * @param {object} pobj
              * @key {string} bookedOfferKey - booked offer key
              * @key {object} historyData - history data; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createWebUserBookingHistory = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'createWebUserBookingHistory';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'bookedOfferKey',
                    paramType: 'string'
                },{
                    paramName: 'historyData',
                    paramType: 'object'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var bookedOfferKey = pobj.bookedOfferKey;
            var historyData = pobj.historyData;
            var obj = {
                type: 'POST',
                apiUrl: 'bookings/' + bookedOfferKey + '/history',
                data: JSON.stringify(historyData),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get booking voting of web user, API base path: /smp/api/bookings, API full path: /smp/api/bookings/{bookedOfferKey}/voting
          * @param {object} pobj
              * @key {string} bookedOfferKey - booked offer key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getBookingVoting = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getBookingVoting';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'bookedOfferKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var bookedOfferKey = pobj.bookedOfferKey;
            var obj = {
                apiUrl: 'bookings/' + bookedOfferKey + '/voting',
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get booking of web user, API base path: /smp/api/bookings, API full path: /smp/api/bookings/{bookedOfferKey}
          * @param {object} pobj
              * @key {string} bookedOfferKey - booked offer key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getWebUserBooking = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getWebUserBooking';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'bookedOfferKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var bookedOfferKey = pobj.bookedOfferKey;
            var obj = {
                apiUrl: 'bookings/' + bookedOfferKey,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get web user booking histories, API base path: /smp/api/bookings, API full path: /smp/api/bookings/{bookedOfferKey}/history
          * @param {object} pobj
              * @key {string} bookedOfferKey - booked offer key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getWebUserBookingHistories = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getWebUserBookingHistories';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'bookedOfferKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var bookedOfferKey = pobj.bookedOfferKey;
            var obj = {
                apiUrl: 'bookings/' + bookedOfferKey + '/history',
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get booking version of web user, API base path: /smp/api/bookings, API full path: /smp/api/bookings/{bookedOfferKey}/version
          * @param {object} pobj
              * @key {string} bookedOfferKey - booked offer key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getWebUserBookingVersion = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getWebUserBookingVersion';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'bookedOfferKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var bookedOfferKey = pobj.bookedOfferKey;
            var obj = {
                apiUrl: 'bookings/' + bookedOfferKey + '/version',
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc cancel booking by web user, API base path: /smp/api/bookings, API full path: /smp/api/bookings/{bookedOfferKey}/history
          * @param {object} pobj
              * @key {string} bookedOfferKey - key of booked offer
              * @key {object} cancellingData (opt) - data of booking to be passed; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} comment (opt) (API url parameter) - key of the offer to be booked
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.webUserCanelBooking = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'webUserCanelBooking';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'bookedOfferKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var bookedOfferKey = pobj.bookedOfferKey;
            var cancellingData = pobj.cancellingData;
            var obj = {
                type: 'POST',
                apiUrl: 'bookings/' + bookedOfferKey + '/history',
                urlParam: helper.assign(cancellingData,{newStatus:'CANCELLED'}),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get all categories of static contents, API base path: /smp/api/content, API full path: /smp/api/content
          * @param {object} pobj
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getAllStaticContentCategories = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getAllStaticContentCategories';
            var ajax = pobj.ajax || {};
            var obj = {
                apiUrl: 'content',
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get all static contents for category, API base path: /smp/api/content, API full path: /smp/api/content/{key}/children
          * @param {object} pobj
              * @key {string} category - category (path) of static content
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getStaticContents = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getStaticContents';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'category',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var category = pobj.category;
            var obj = {
                apiUrl: 'content/' + category + '/children',
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc create/post context, API base path: /smp/api/contexts, API full path: /smp/api/contexts
          * @param {object} pobj
              * @key {object} context - context config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createContext = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'createContext';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'context',
                    paramType: 'object'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var context = pobj.context;
            var obj = {
                type: 'POST',
                apiUrl: 'contexts',
                urlParam: {locationId:context.locationId},
                data: JSON.stringify(context),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc delete context, API base path: /smp/api/contexts, API full path: /smp/api/contexts/{key}
          * @param {object} pobj
              * @key {string} contextKey - context key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteContext = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'deleteContext';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'contextKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var contextKey = pobj.contextKey;
            var error = ajax.error;
            var obj = {
                type: 'DELETE',
                apiUrl: 'contexts/' + contextKey,
                error: function(jqXHR,textStatus,errorThrown){
                    if (isType(error,'function')) {error(jqXHR,textStatus,errorThrown);}
                },
                functionName: functionName
            };
            delete ajax.error;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find context, API base path: /smp/api/contexts, API full path: /smp/api/contexts
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {number} limit (opt) (API url parameter) - number of the results
                  * @key {number} locationId (opt) (API url parameter) - ID of location
                  * @key {number} offset (opt) (API url parameter) - offset of the results
                  * @key {boolean} superseded (opt) (API url parameter) - superseded
                  * @key {string} webkitConfigKey (opt) (API url parameter) - webkit config key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findContext = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findContext';
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'contexts',
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get context, API base path: /smp/api/contexts, API full path: /smp/api/contexts/{key}
          * @param {object} pobj
              * @key {string} contextKey - context key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getContext = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getContext';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'contextKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var contextKey = pobj.contextKey;
            var obj = {
                apiUrl: 'contexts/' + contextKey,
                urlParam: {locationId: 1},
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc update/put context, API base path: /smp/api/contexts, API full path: /smp/api/contexts/{key}
          * @param {object} pobj
              * @key {object} context - context config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateContext = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'updateContext';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'context',
                    paramType: 'object'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var context = pobj.context;
            var obj = {
                type: 'PUT',
                apiUrl: 'contexts/' + context.key,
                data: JSON.stringify(context),
                urlParam: {locationId:context.locationId},
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find country configuration, API base path: /smp/api/countryconfig, API full path: /smp/api/countryconfig
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} countryCode (opt) (API url parameter) - country code; "DE", "GB", "PL", or other country codes that can be found by function findCountryConfig()
                  * @key {string} orderBy (opt) (API url parameter) - order by
                  * @key {boolean} ascending (opt) (API url parameter) - in ascending order nor not
                  * @key {number} offset (opt) (API url parameter) - offset of the results
                  * @key {number} limit (opt) (API url parameter) - number of the results
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findCountryConfig = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findCountryConfig';
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'countryconfig',
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get country configuration of the current context, API base path: /smp/api/countryconfig/current, API full path: /smp/api/countryconfig/current
          * @param {object} pobj
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getCurrentCountryConfig = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getCurrentCountryConfig';
            var ajax = pobj.ajax || {};
            var obj = {
                apiUrl: 'countryconfig/current',
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get all fluid types, API base path: /smp/api/fluidtypes, API full path: /smp/api/fluidtypes
          * @param {object} pobj
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getAllFluidTypes = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getAllFluidTypes';
            var ajax = pobj.ajax || {};
            var obj = {
                apiUrl: 'fluidtypes',
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find location, API base path: /smp/api/locations, API full path: /smp/api/locations
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} context (opt) (API url parameter) - context
                  * @key {string} limit (opt) (API url parameter) - number of the results
                  * @key {string} offset (opt) (API url parameter) - offset of the results
                  * @key {string} radius (opt) (API url parameter) - search radius
                  * @key {string} regionSignature (opt) (API url parameter) - signature of the region
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findLocation = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findLocation';
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'locations',
                urlParam: extend({context:self.getProperty('contextKey')},criteria),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get guild membership, API base path: /smp/api/locations/guildmembership, API full path: /smp/api/locations/guildmembership/{id}
          * @param {object} pobj
              * @key {string or number} guildmembershipId - ID of the guildmembership
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getGuildmembership = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getGuildmembership';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'guildmembershipId',
                    paramType: 'string or number'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var guildmembershipId = pobj.guildmembershipId;
            var obj = {
                apiUrl: 'locations/guildmembership/' + guildmembershipId,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get location, API base path: /smp/api/locations, API full path: /smp/api/locations/{locationId}
          * @param {object} pobj
              * @key {string} locationId - ID of the location; if not set, default value would be self.getProperty('locationId')
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getLocation = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getLocation';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'locationId',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var locationId = !isType(pobj.locationId,'undefined') ? pobj.locationId : self.getProperty('locationId');
            var obj = {
                apiUrl: 'locations/' + locationId,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get location ratings, API base path: /smp/api/locations, API full path: /smp/api/locations/{locationId}/voting
          * @param {object} pobj
              * @key {string or number} locationId - ID of location
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getLocationRatings = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getLocationRatings';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'locationId',
                    paramType: 'string or number'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var locationId = pobj.locationId;
            var obj = {
                apiUrl: 'locations/' + locationId + '/voting',
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get offer forward URL, API base path: /smp/api/locations, API full path: /smp/api/locations/{locationId}/forward
          * @param {object} pobj
              * @key {string or number} locationId - ID of location
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOfferForwarURL = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getOfferForwarURL';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'locationId',
                    paramType: 'string or number'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var locationId = pobj.locationId;
            var obj = {
                apiUrl: 'locations/' + locationId + '/forward',
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc is location bookable online, API base path: /smp/api/locations, API full path: /smp/api/locations/{locationId}/online/bookings
          * @param {object} pobj
              * @key {number or string} locationId - ID of location
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.isLocationBookableOnline = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'isLocationBookableOnline';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'locationId',
                    paramType: 'number or string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var locationId = pobj.locationId;
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'locations/' + locationId + '/online/bookings',
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc create mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs
          * @param {object} pobj
              * @key {object} mailConfig - mail configuration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} countryCode - country code; "DE", "GB", "PL", or other country codes that can be found by function findCountryConfig()
                  * @key {string} languageCode - language code; "de", "en", "pl", or other language codes that can be found by function findCountryConfig()
                  * @key {string} name - name of the mail configuration
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createMailConfig = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'createMailConfig';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'mailConfig',
                    paramType: 'object'
                },{
                    paramName: 'countryCode',
                    paramType: 'string',
                    defaultValue: self.getProperty('countryCode'),
                    parentObj: 'mailConfig'
                },{
                    paramName: 'languageCode',
                    paramType: 'string',
                    defaultValue: self.getProperty('languageCode'),
                    parentObj: 'mailConfig'
                },{
                    paramName: 'name',
                    paramType: 'string',
                    parentObj: 'mailConfig'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var mailConfig = pobj.mailConfig;
            var obj = {
                type: 'POST',
                apiUrl: 'mailconfigs',
                data: JSON.stringify(mailConfig),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc create mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates
          * @param {object} pobj
              * @key {object} mailTemplate - mail template; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} mailConfigId - ID of the mail configuration
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createMailTemplate = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'createMailTemplate';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'mailTemplate',
                    paramType: 'object'
                },{
                    paramName: 'mailConfigId',
                    paramType: 'string',
                    parentObj: 'mailTemplate'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var mailTemplate = pobj.mailTemplate;
            var obj = {
                type: 'POST',
                apiUrl: 'mailconfigs/' + mailTemplate.mailConfigId + '/templates',
                data: JSON.stringify(mailTemplate),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc delete all mail templates, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates
          * @param {object} pobj
              * @key {string} mailConfigId - ID of the mail configuration
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteAllMailTemplates = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'deleteAllMailTemplates';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'mailConfigId',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var mailConfigId = pobj.mailConfigId;
            var obj = {
                type: 'DELETE',
                apiUrl: 'mailconfigs/' + mailConfigId + '/templates',
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc delete mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{id}
          * @param {object} pobj
              * @key {string} mailConfigId - ID of the mail configuration
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteMailConfig = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'deleteMailConfig';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'mailConfigId',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var mailConfigId = pobj.mailConfigId;
            var obj = {
                type: 'DELETE',
                apiUrl: 'mailconfigs/' + mailConfigId,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc delete mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates/{templateId}
          * @param {object} pobj
              * @key {string} mailConfigId - ID of the mail configuration
              * @key {string} templateId - ID of the mail template
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteMailTemplate = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'deleteMailTemplate';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'mailConfigId',
                    paramType: 'string'
                },{
                    paramName: 'templateId',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var mailConfigId = pobj.mailConfigId;
            var templateId = pobj.templateId;
            var obj = {
                type: 'DELETE',
                apiUrl: 'mailconfigs/' + mailConfigId + '/templates/' + templateId,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} countryCode (opt) (API url parameter) - country code; "DE", "GB", "PL", or other country codes that can be found by function findCountryConfig()
                  * @key {boolean} isPublic (opt) (API url parameter) - whether the mail configuration is public or not
                  * @key {string} languageCode (opt) (API url parameter) - language code; "de", "en", "pl", or other language codes that can be found by function findCountryConfig()
                  * @key {string} name (opt) (API url parameter) - name of the mail configuration
                  * @key {number} locationId (opt) (API url parameter) - ID of location
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findMailConfig = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findMailConfig';
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'mailconfigs',
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates
          * @param {object} pobj
              * @key {object} criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} mailConfigId (API url parameter) - ID of the mail configuration
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findMailTemplate = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findMailTemplate';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'criteria',
                    paramType: 'object'
                },{
                    paramName: 'mailConfigId',
                    paramType: 'string',
                    parentObj: 'criteria'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'mailconfigs/' + criteria.mailConfigId + '/templates',
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{id}
          * @param {object} pobj
              * @key {string} mailConfigId - ID of the mail configuration
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getMailConfig = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getMailConfig';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'mailConfigId',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var mailConfigId = pobj.mailConfigId;
            var obj = {
                apiUrl: 'mailconfigs/' + mailConfigId,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates/{templateId}
          * @param {object} pobj
              * @key {string} mailConfigId - ID of the mail configuration
              * @key {string} templateId - ID of the mail template
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getMailTemplate = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getMailTemplate';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'mailConfigId',
                    paramType: 'string'
                },{
                    paramName: 'templateId',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var mailConfigId = pobj.mailConfigId;
            var templateId = pobj.templateId;
            var obj = {
                apiUrl: 'mailconfigs/' + mailConfigId + '/templates/' + templateId,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc update mail configuration, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{id}
          * @param {object} pobj
              * @key {object} mailConfig - mail configuration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateMailConfig = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'updateMailConfig';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'mailConfig',
                    paramType: 'object'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var mailConfig = pobj.mailConfig;
            var obj = {
                type: 'PUT',
                apiUrl: 'mailconfigs/' + mailConfig.id,
                data: JSON.stringify(mailConfig),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc update mail template, API base path: /smp/api/mailconfigs, API full path: /smp/api/mailconfigs/{mailconfigId}/templates/{templateId}
          * @param {object} pobj
              * @key {object} mailTemplate - mail template; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} mailConfigId (API url parameter) - ID of the mail configuration
                  * @key {string} id (API url parameter) - ID of the mail template
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateMailTemplate = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'updateMailTemplate';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'mailTemplate',
                    paramType: 'object'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var mailTemplate = pobj.mailTemplate;
            var obj = {
                type: 'PUT',
                apiUrl: 'mailconfigs/' + mailTemplate.mailConfigId + '/templates/' + mailTemplate.id,
                data: JSON.stringify(mailTemplate),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get offer by offer key, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerKey}/details
          * @param {object} pobj
              * @key {string} offerKey - offer key
              * @key {object} criteria (opt) - criteria to show the offer; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOffer = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getOffer';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'offerKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var offerKey = pobj.offerKey;
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'offers/' + offerKey + '/details',
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get email template, used to send the offer, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerKey}/mailcontent
          * @param {object} pobj
              * @key {string} offerKey - offer key
              * @key {object} criteria (opt) - criteria to show the offer; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOfferEmail = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getOfferEmail';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'offerKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var offerKey = pobj.offerKey;
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'offers/list/' + offerKey + '/mailcontent',
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get offer list, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerSearchKey}
          * @param {object} pobj
              * @key {string} offerSearchKey - offer search key
              * @key {object} criteria (opt) - criteria to show the results; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {number or string} limit (opt) (API url parameter) - number of the results
                  * @key {number or string} offset (opt) (API url parameter) - offset of the results
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOfferList = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getOfferList';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'offerSearchKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var offerSearchKey = pobj.offerSearchKey;
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'offers/' + offerSearchKey,
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get offer list filters, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerSearchKey}/filters
          * @param {object} pobj
              * @key {string} offerSearchKey - offer search key
              * @key {object} criteria (opt) - criteria to show the results; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {number or string} filterConfig (opt) (API url parameter) - filter configuration
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOfferListFilters = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getOfferListFilters';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'offerSearchKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var offerSearchKey = pobj.offerSearchKey;
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'offers/' + offerSearchKey + '/filters',
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get time slot for offer with offer key, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerKey}/timeslot
          * @param {object} pobj
              * @key {string} offerKey - offer key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOfferTimeSlot = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getOfferTimeSlot';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'offerKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var offerKey = pobj.offerKey;
            var obj = {
                apiUrl: 'offers/' + offerKey + '/timeslot',
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc send the offer with the email template, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerKey}/mail
          * @param {object} pobj
              * @key {string} offerKey - offer key
              * @key {object} offerMail - offer email; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.sendOfferEmail = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'sendOfferEmail';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'offerKey',
                    paramType: 'string'
                },{
                    paramName: 'offerMail',
                    paramType: 'object'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var offerKey = pobj.offerKey;
            var offerMail = pobj.offerMail;
            var obj = {
                type: 'POST',
                apiUrl: 'offers/list/' + offerKey + '/mail',
                data: JSON.stringify(offerMail),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc create offer search, API base path: /smp/api/offersearches, API full path: /smp/api/offersearches
          * @param {object} pobj
              * @key {object} offerSearch - use user search key and region to create an offer search; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {object} userSearchConfigKey - user search key
                  * @key {object} region (opt) - search offers in the given region
                  * @key {boolean} generateEmptyOffer (opt) - whether locations with no offer will be included in the result list
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createOfferSearch = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'createOfferSearch';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'offerSearch',
                    paramType: 'object'
                },{
                    paramName: 'userSearchConfigKey',
                    paramType: 'object',
                    parentObj: 'offerSearch'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var offerSearch = pobj.offerSearch;
            var obj = {
                type: 'POST',
                apiUrl: 'offersearches',
                data: JSON.stringify(offerSearch),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get offer search, API base path: /smp/api/offersearches, API full path: /smp/api/offersearches/{offerSearchKey}
          * @param {object} pobj
              * @key {string} offerSearchKey - offer search key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOfferSearch = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getOfferSearch';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'offerSearchKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var offerSearchKey = pobj.offerSearchKey;
            var obj = {
                apiUrl: 'offersearches/' + offerSearchKey,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get all part qualities, API base path: /smp/api/partqualities, API full path: /smp/api/partqualities
          * @param {object} pobj
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getAllPartQualities = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getAllPartQualities';
            var ajax = pobj.ajax || {};
            var obj = {
                apiUrl: 'partqualities',
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

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
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findRegion';
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var obj = {
                apiUrl: 'regions',
                urlParam: criteria,
                success: function(data){
                    if (isType(quickHandle,'function')) {
                        var newData = [];
                        helper.each(data,function(region){
                            newData.push({
                                formattedName: region.formattedName,
                                nearbyLocationCount: region.nearbyLocationCount,
                                signature: region.signature
                            });
                        });
                        quickHandle(newData);
                    }
                    if (isType(success,'function')) {success(data);}
                },
                functionName: functionName
            };
            delete ajax.success;
            self.api(extend(obj,ajax));
        };

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
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getRegionBySignature';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'signature',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var signature = pobj.signature;
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var obj = {
                apiUrl: 'regions/signature/' + signature,
                success: function(data){
                    if (isType(quickHandle,'function')) {
                        newData = {
                            formattedName: data.formattedName,
                            nearbyLocationCount: data.nearbyLocationCount,
                            signature: data.signature
                        };
                        quickHandle(newData);
                    }
                    if (isType(success,'function')) {success(data);}
                },
                functionName: functionName
            };
            delete ajax.success;
            self.api(extend(obj,ajax));
        };

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
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getRegionOfUser';
            var ajax = pobj.ajax || {};
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var obj = {
                apiUrl: 'regions/default',
                success: function(data){
                    if (isType(quickHandle,'function')) {
                        newData = {
                            formattedName: data.formattedName,
                            nearbyLocationCount: data.nearbyLocationCount,
                            signature: data.signature
                        };
                        quickHandle(newData);
                    }
                    if (isType(success,'function')) {success(data);}
                },
                functionName: functionName
            };
            delete ajax.success;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find service, API base path: /smp/api/services/services, API full path: /smp/api/services/services
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} searchTerm (opt) (API url parameter) - search term, name of the service
                  * @key {string} vehicleTypeId (opt) (API url parameter) - ID of vehicle type
                  * @key {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the UTC milliseconds format
                  * @key {number or string} offset (opt) (API url parameter) - offset of the results
                  * @key {number or string} limit (opt) (API url parameter) - number of the results
              * @key {function} quickHandle (opt) - quickHandle function with parameter (data) of type array of objects
                    The structure of each object in parameter data:
                        serviceId - number, ID of service
                        serviceName - string, name of the service
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findService = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findService';
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var obj = {
                apiUrl: 'services/services',
                urlParam: criteria,
                success: function(data){
                    if (isType(quickHandle,'function')) {
                        var newData = [];
                        helper.each(data,function(service){
                            newData.push({
                                serviceId: service.id,
                                serviceName: service.name
                            });
                        });
                        quickHandle(newData);
                    }
                    if (isType(success,'function')) {success(data);}
                },
                functionName: functionName
            };
            delete ajax.success;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find service by catalog, API base path: /smp/api/services/catalog, API full path: /smp/api/services/catalog/{serviceCategoryId}
          * @param {object} pobj
              * @key {string} serviceCategoryId - ID of service category
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the UTC milliseconds format
                  * @key {string} vehicleTypeId (opt) (API url parameter) - ID of vehicle type
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findServiceByCatalog = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findServiceByCatalog';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'serviceCategoryId',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var serviceCategoryId = pobj.serviceCategoryId;
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'services/catalog/' + serviceCategoryId,
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find top services for vehicle with ID of vehicle type, API base path: /smp/api/services/services/top, API full path: /smp/api/services/services/top/{vehicleTypeId}
          * @param {object} pobj
              * @key {string} vehicleTypeId - ID of vehicle type
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the UTC milliseconds format
                  * @key {number or string} offset (opt) (API url parameter) - offset of the results
                  * @key {number or string} limit (opt) (API url parameter) - number of the results
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findTopServiceForVehicle = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findTopServiceForVehicle';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'vehicleTypeId',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var vehicleTypeId = pobj.vehicleTypeId;
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'services/services/top/' + vehicleTypeId,
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get all inspection service positions, API base path: /smp/api/services/servicepositions, API full path: /smp/api/services/servicepositions/{serviceId}/{vehicleTypeId}/{constructionTime}
          * @param {object} pobj
              * @key {string or number} vehicleTypeId - ID of vehicle type
              * @key {string or number} serviceId - ID of the inspection service
              * @key {string} constructionTime - construction time of the vehicle, in the UTC milliseconds format
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} equipmentCodes (opt) (API url parameter) - equipment code of the vehicle
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getAllInspectionServicePositions = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getAllInspectionServicePositions';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'vehicleTypeId',
                    paramType: 'string or number'
                },{
                    paramName: 'serviceId',
                    paramType: 'string or number'
                },{
                    paramName: 'constructionTime',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var vehicleTypeId = pobj.vehicleTypeId;
            var serviceId = pobj.serviceId;
            var constructionTime = pobj.constructionTime;
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'services/servicepositions/' + serviceId + '/' + vehicleTypeId + '/' + constructionTime,
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get service by service ID, API base path: /smp/api/services/services, API full path: /smp/api/services/services/{id}
          * @param {object} pobj
              * @key {string} serviceId - ID of service
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the UTC milliseconds format
                  * @key {string} vehicleTypeId (opt) (API url parameter) - ID of vehicle type
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getServiceById = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getServiceById';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'serviceId',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var serviceId = pobj.serviceId;
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'services/services/' + serviceId,
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get service category, API base path: /smp/api/services/servicecategories, API full path: /smp/api/services/servicecategories/{serviceCategoryId}
          * @param {object} pobj
              * @key {string} serviceCategoryId - ID of service category
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getServiceCategory = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getServiceCategory';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'serviceCategoryId',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var serviceCategoryId = pobj.serviceCategoryId;
            var obj = {
                apiUrl: 'services/servicecategories/' + serviceCategoryId,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc FG internal tracking, API base path: /smp/api/tracking/json, API full path: /smp/api/tracking/json
          * @param {object} pobj
              * @key {object} trackingData - The info summarizing the event to be tracked; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.track = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'track';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'trackingData',
                    paramType: 'object'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var trackingData = pobj.trackingData;
            var obj = {
                type: 'POST',
                apiUrl: 'tracking/json',
                data: JSON.stringify(trackingData),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc register as individual FairGarage user. If this step is successful, the user will receive an email concerning setting the password, to complete the registration, API base path: /smp/api/users, API full path: /smp/api/users
          * @param {object} pobj
              * @key {object} registrationData - data of registration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} salutation - salutation, accepted values are 'm' (for male) and 'f' (for female)
                  * @key {string} givenname - given name
                  * @key {string} surname - surname
                  * @key {string} username - username, or email address
                  * @key {string} locationId - the user will be registered to this location
                  * @key {array of objects, the agreement objects can be obtained by findAgreement} acceptedAgreements - accepted agreements
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.registerUser = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'registerUser';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'registrationData',
                    paramType: 'object'
                },{
                    paramName: 'salutation',
                    paramType: 'string',
                    parentObj: 'registrationData'
                },{
                    paramName: 'givenname',
                    paramType: 'string',
                    parentObj: 'registrationData'
                },{
                    paramName: 'surname',
                    paramType: 'string',
                    parentObj: 'registrationData'
                },{
                    paramName: 'username',
                    paramType: 'string',
                    parentObj: 'registrationData'
                },{
                    paramName: 'locationId',
                    paramType: 'string',
                    parentObj: 'registrationData'
                },{
                    paramName: 'acceptedAgreements',
                    paramType: 'array of objects, the agreement objects can be obtained by findAgreement',
                    parentObj: 'registrationData'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var registrationData = pobj.registrationData;
            var obj = {
                type: 'POST',
                apiUrl: 'users',
                data: JSON.stringify(registrationData),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc update FairGarage user information, API base path: /smp/api/users, API full path: /smp/api/users/{userId}
          * @param {object} pobj
              * @key {object} userData - data of user; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} id - ID of the user
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateUser = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'updateUser';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'userData',
                    paramType: 'object'
                },{
                    paramName: 'id',
                    paramType: 'string',
                    parentObj: 'userData'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var userData = pobj.userData;
            var obj = {
                type: 'PUT',
                apiUrl: 'users/' + userData.id,
                data: JSON.stringify(userData),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc create user search, API base path: /smp/api/usersearches, API full path: /smp/api/usersearches
          * @param {object} pobj
              * @key {object} userSearchData - use vehicle, and service to create a user search
                  * @key {object} selectedVehicle - selected vehicle
                  * @key {array of objects} selectedServiceList - list of selected services
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createUserSearch = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'createUserSearch';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'userSearchData',
                    paramType: 'object'
                },{
                    paramName: 'selectedVehicle',
                    paramType: 'object',
                    parentObj: 'userSearchData'
                },{
                    paramName: 'selectedServiceList',
                    paramType: 'array of objects',
                    parentObj: 'userSearchData'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var userSearchData = pobj.userSearchData;
            var obj = {
                type: 'POST',
                apiUrl: 'usersearches',
                data: JSON.stringify(userSearchData),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get user search, API base path: /smp/api/usersearches, API full path: /smp/api/usersearches/{userSearchKey}
          * @param {object} pobj
              * @key {string} userSearchKey - user search key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getUserSearch = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getUserSearch';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'userSearchKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var userSearchKey = pobj.userSearchKey;
            var obj = {
                apiUrl: 'usersearches/' + userSearchKey,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

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
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findVehicleByDocument';
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'vehicles/vehicletypes',
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get vehicle by VIN, API base path: /smp/api/vehicles/vehicles, API full path: /smp/api/vehicles/vehicles/{vin}
          * @param {object} pobj
              * @key {string} vin - VIN of the vehicle
              * @key {boolean} saveVehicle (opt) - save the found vehicle, if only one vehicle is found, by setProperties into "vehicle"
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getVehicleByVIN = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getVehicleByVIN';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'vin',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var vin = pobj.vin;
            var saveVehicle = pobj.saveVehicle;
            var success = ajax.success;
            var obj = {
                apiUrl: 'vehicles/vehicles/' + vin,
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
                        selectedVehicle.constructionTime.time = (criteria && criteria.constructionTime) ? self.dateToTimestamp(criteria.constructionTime) : self.dateToTimestamp(year + '-' + (data.constructionTimeMap[year].sort(function(a,b){return a-b})[0]));
                        self.setProperties({selectedVehicle:selectedVehicle});
                    }
                    if (isType(success,'function')) {success(data);}
                },
                functionName: functionName
            };
            delete ajax.success;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc evaluate a vehicle, API base path: /smp/api/vehicles/evaluation, API full path: /smp/api/vehicles/evaluation
          * @param {object} pobj
              * @key {object} valuatedVehicle - vehicle information for the evaluation
                  * @key {object} datVehicleContainer - vehicle information used for the DAT evaluation; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                        The basic structure of this object datVehicleContainer:
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
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'evaluateVehicle';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'valuatedVehicle',
                    paramType: 'object'
                },{
                    paramName: 'datVehicleContainer',
                    paramType: 'object',
                    parentObj: 'valuatedVehicle'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var valuatedVehicle = pobj.valuatedVehicle;
            var criteria = pobj.criteria;
            var obj = {
                type: 'POST',
                apiUrl: 'vehicles/evaluation',
                urlParam: criteria,
                data: JSON.stringify(extend(true,{datVehicleContainer:{registrationDate:{time:self.dateToTimestamp(self.getFirstDateInConstructionTimeMap(valuatedVehicle.datVehicleContainer.vehicleType.constructionTimeMap))}}},valuatedVehicle)),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find equipments for vehicle and selected service, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes/{id}/equipments
          * @param {object} pobj
              * @key {string} vehicleTypeId - ID of vehicle type
              * @key {string} serviceId - ID of service
              * @key {string} constructionTime - construction time of the vehicle, in the UTC milliseconds format
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findEquipmentsForVehicleAndService = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findEquipmentsForVehicleAndService';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'vehicleTypeId',
                    paramType: 'string'
                },{
                    paramName: 'serviceId',
                    paramType: 'string'
                },{
                    paramName: 'constructionTime',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var vehicleTypeId = pobj.vehicleTypeId;
            var serviceId = pobj.serviceId;
            var constructionTime = pobj.constructionTime;
            var obj = {
                apiUrl: 'vehicles/vehicletypes/' + vehicleTypeId + '/equipments/' + serviceId + '/' + constructionTime,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find vehicle by catalog, API base path: /smp/api/vehicles/catalog, API full path: /smp/api/vehicles/catalog/{vehicleCategoryId}
          * @param {object} pobj
              * @key {string} vehicleCategoryId - vehicle category ID. To find IDs of the next category, start with "62303" (default) for SUV/passenger cars, or "83503" for transporters
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the UTC milliseconds format
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
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findVehicleByCatalog';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'vehicleCategoryId',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var vehicleCategoryId = !isType(pobj.vehicleCategoryId,'undefined') ? pobj.vehicleCategoryId : '62303';
            var criteria = pobj.criteria;
            var quickHandle = pobj.quickHandle;
            var saveVehicle = pobj.saveVehicle;
            var success = ajax.success;
            var obj = {
                apiUrl: 'vehicles/catalog/' + vehicleCategoryId,
                urlParam: criteria,
                success: function(data){
                    if (saveVehicle && data.types.length == 1) {
                        var selectedVehicle = {
                            constructionTime: {time:null},
                            equipmentList: [],
                            vehicleType: data.types[0]
                        };
                        var years = [];
                        for (var year in data.types[0].constructionTimeMap) {
                            years.push(year);
                        }
                        var thisYear = years.sort()[0];
                        selectedVehicle.constructionTime.time = (criteria && criteria.constructionTime) ? self.dateToTimestamp(criteria.constructionTime) : self.dateToTimestamp(thisYear + '-' + (data.types[0].constructionTimeMap[thisYear].sort(function(a,b){return a-b;})[0]));
                        //selectedVehicle.constructionTime.time = (criteria && criteria.constructionTime) ? self.dateToTimestamp(criteria.constructionTime) : self.dateToTimestamp(self.getFirstDateInConstructionTimeMap(data.types[0].constructionTimeMap)));
                        self.setProperties({selectedVehicle:selectedVehicle});
                    }
                    if (isType(quickHandle,'function')) {
                        var newData = [];
                        var key = 'categories';
                        if (data.types.length > 0) {
                            key = 'types';
                        }
                        helper.each(data[key],function(vehicleType){
                            newData.push({
                                lastLevel: key === 'types',
                                id: vehicleType.id,
                                name: vehicleType.name,
                                externalId: (key === 'types' ? vehicleType.externalId : null),
                                properties: []
                            });
                            helper.each(vehicleType.properties,function(property){
                                newData[newData.length - 1].properties.push({
                                    name: property.type.name,
                                    value: property.value
                                });
                            });
                        });
                        quickHandle(newData);
                    }
                    if (isType(success,'function')) {success(data);}
                },
                functionName: functionName
            };
            delete ajax.success;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find vehicle by the external ID of the vehicle, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes
          * @param {object} pobj
              * @key {object} criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} externalId (API url parameter) - external ID or Ecode of the vehicle
              * @key {boolean} saveVehicle (opt) - save the found vehicle, if only one vehicle is found, by setProperties into "vehicle"
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleByExternalId = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findVehicleByExternalId';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'criteria',
                    paramType: 'object'
                },{
                    paramName: 'externalId',
                    paramType: 'string',
                    parentObj: 'criteria'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var criteria = pobj.criteria;
            var saveVehicle = pobj.saveVehicle;
            var success = ajax.success;
            var obj = {
                apiUrl: 'vehicles/vehicletypes',
                urlParam: criteria,
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
                    if (isType(success,'function')) {success(data);}
                },
                functionName: functionName
            };
            delete ajax.success;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find vehicle by HSN/TSN of the vehicle, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes
          * @param {object} pobj
              * @key {object} criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} hsn (API url parameter) - HSN of the vehicle
                  * @key {string} tsn (API url parameter) - TSN of the vehicle
              * @key {boolean} saveVehicle (opt) - save the found vehicle, if only one vehicle is found, by setProperties into "vehicle"
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleByHSNTSN = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findVehicleByHSNTSN';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'criteria',
                    paramType: 'object'
                },{
                    paramName: 'hsn',
                    paramType: 'string',
                    parentObj: 'criteria'
                },{
                    paramName: 'tsn',
                    paramType: 'string',
                    parentObj: 'criteria'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var criteria = pobj.criteria;
            var saveVehicle = pobj.saveVehicle;
            var success = ajax.success;
            var obj = {
                apiUrl: 'vehicles/vehicletypes',
                urlParam: criteria,
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
                    if (isType(success,'function')) {success(data);}
                },
                functionName: functionName
            };
            delete ajax.success;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find vehicle equipment for selected service, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes/{id}/equipments/{serviceId}/{constructionTime}
          * @param {object} pobj
              * @key {string} vehicleTypeId - ID of vehicle type
              * @key {string} serviceId - ID of service
              * @key {string} constructionTime - construction time of the vehicle, in the UTC milliseconds format
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findVehicleEquipmentForService = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findVehicleEquipmentForService';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'vehicleTypeId',
                    paramType: 'string'
                },{
                    paramName: 'serviceId',
                    paramType: 'string'
                },{
                    paramName: 'constructionTime',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var vehicleTypeId = pobj.vehicleTypeId;
            var serviceId = pobj.serviceId;
            var constructionTime = pobj.constructionTime;
            var obj = {
                apiUrl: 'vehicles/vehicletypes/' + vehicleTypeId + '/equipments/' + serviceId + '/' + constructionTime,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get all equipments for vehicle, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes/{id}/equipments
          * @param {object} pobj
              * @key {string} vehicleTypeId - ID of vehicle type
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getAllEquipmentsForVehicle = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getAllEquipmentsForVehicle';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'vehicleTypeId',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var vehicleTypeId = pobj.vehicleTypeId;
            var obj = {
                apiUrl: 'vehicles/vehicletypes/' + vehicleTypeId + '/equipments',
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get vehicle by vehicle type ID, API base path: /smp/api/vehicles/vehicletypes, API full path: /smp/api/vehicles/vehicletypes/{id}
          * @param {object} pobj
              * @key {string} vehicleTypeId - ID of vehicle type
              * @key {boolean} saveVehicle (opt) - save the found vehicle, if only one vehicle is found, by setProperties into "vehicle"
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getVehicleByVehicleTypeId = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getVehicleByVehicleTypeId';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'vehicleTypeId',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var vehicleTypeId = pobj.vehicleTypeId;
            var saveVehicle = pobj.saveVehicle;
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
                    if (isType(success,'function')) {success(data);}
                },
                functionName: functionName
            };
            delete ajax.success;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get vehicle category, API base path: /smp/api/vehicles/vehiclecategories, API full path: /smp/api/vehicles/vehiclecategories/{vehicleCategoryId}
          * @param {object} pobj
              * @key {string or number} vehicleCategoryId - vehicle category ID
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getVehicleCategory = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getVehicleCategory';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'vehicleCategoryId',
                    paramType: 'string or number'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var vehicleCategoryId = pobj.vehicleCategoryId;
            var obj = {
                apiUrl: 'vehicles/vehiclecategories/' + vehicleCategoryId,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc create webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs
          * @param {object} pobj
              * @key {object} webkitConfig - webkit config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createWebkitConfig = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'createWebkitConfig';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'webkitConfig',
                    paramType: 'object'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var webkitConfig = pobj.webkitConfig;
            var obj = {
                type: 'POST',
                apiUrl: 'webkit/webkitconfigs',
                data: JSON.stringify(webkitConfig),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc delete webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs/{key}
          * @param {object} pobj
              * @key {string} webkitConfigKey - webkit config key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.deleteWebkitConfig = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'deleteWebkitConfig';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'webkitConfigKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var webkitConfigKey = pobj.webkitConfigKey;
            var error = ajax.error;
            var obj = {
                type: 'DELETE',
                apiUrl: 'webkit/webkitconfigs/' + webkitConfigKey,
                error: function(jqXHR,textStatus,errorThrown){
                    if (isType(error,'function')) {error(jqXHR,textStatus,errorThrown);}
                },
                functionName: functionName
            };
            delete ajax.error;
            self.api(extend(obj,ajax));
        };

        /**
          * @desc find webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs
          * @param {object} pobj
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {number} limit (opt) (API url parameter) - number of the results
                  * @key {number} offset (opt) (API url parameter) - offset of the results
                  * @key {number} locationId (opt) (API url parameter) - ID of location
                  * @key {boolean} superseded (opt) (API url parameter) - superseded
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findWebkitConfig = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'findWebkitConfig';
            var ajax = pobj.ajax || {};
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'webkit/webkitconfigs',
                urlParam: criteria,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc get webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs/{key}
          * @param {object} pobj
              * @key {string} webkitConfigKey - webkit config key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getWebkitConfig = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'getWebkitConfig';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'webkitConfigKey',
                    paramType: 'string'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var webkitConfigKey = pobj.webkitConfigKey;
            var obj = {
                apiUrl: 'webkit/webkitconfigs/' + webkitConfigKey,
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        /**
          * @desc update/put webkit config, API base path: /smp/api/webkit/webkitconfigs, API full path: /smp/api/webkit/webkitconfigs/{key}
          * @param {object} pobj
              * @key {object} webkitConfig - webkit config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} key - webkit config key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateWebkitConfig = function(pobj){
            if (isType(pobj,'undefined')) {
                pobj = {};
            }
            var functionName = 'updateWebkitConfig';
            var ajax = pobj.ajax || {};
            //----- check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'webkitConfig',
                    paramType: 'object'
                },{
                    paramName: 'key',
                    paramType: 'string',
                    parentObj: 'webkitConfig'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end
            var webkitConfig = pobj.webkitConfig;
            var obj = {
                type: 'PUT',
                apiUrl: 'webkit/webkitconfigs/' + webkitConfig.key,
                data: JSON.stringify(webkitConfig),
                functionName: functionName
            };
            self.api(extend(obj,ajax));
        };

        return self;
    };

})(jQuery);