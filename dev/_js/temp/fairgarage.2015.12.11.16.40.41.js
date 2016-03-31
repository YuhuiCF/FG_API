
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
          * @desc get location, API base path: /smp/api/locations, API full path: /smp/api/locations/{locationId}
          * @param {object} pobj
              * @key {string} locationId - ID of the location; if not set, default value would be self.getProperty('locationId')
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getLocation = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var functionName = 'getLocation';
            var ajax = pobj.ajax || {};
// check mandatory fields start
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
// check mandatory fields end
            var locationId = typeof pobj.locationId !== 'undefined' ? pobj.locationId : self.getProperty('locationId');
            var obj = {
                apiUrl: 'locations/' + locationId,
                functionName: functionName + '()'
            };
            self.api($.extend(obj,ajax));
        };

        /**
          * @desc get offer by offer key, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerKey}/details
          * @param {object} pobj
              * @key {string} offerKey - offer key
              * @key {object} criteria (opt) - criteria to show the offer; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOffer = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var functionName = 'getOffer';
            var ajax = pobj.ajax || {};
// check mandatory fields start
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
// check mandatory fields end
            var offerKey = pobj.offerKey;
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'offers/' + offerKey + '/details',
                urlParam: criteria,
                functionName: functionName + '()'
            };
            self.api($.extend(obj,ajax));
        };

        /**
          * @desc get offer list, API base path: /smp/api/offers, API full path: /smp/api/offers/{offerSearchKey}
          * @param {object} pobj
              * @key {string} offerSearchKey - offer search key
              * @key {object} criteria (opt) - criteria to show the results; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {number or string} limit (opt) (API url parameter) - number of results in list of offers
                  * @key {number or string} offset (opt) (API url parameter) - offset of results in list of offers
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOfferList = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var functionName = 'getOfferList';
            var ajax = pobj.ajax || {};
// check mandatory fields start
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
// check mandatory fields end
            var offerSearchKey = pobj.offerSearchKey;
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'offers/' + offerSearchKey,
                urlParam: criteria,
                functionName: functionName + '()'
            };
            self.api($.extend(obj,ajax));
        };

        /**
          * @desc create offer search, API base path: /smp/api/offersearches, API full path: /smp/api/offersearches
          * @param {object} pobj
              * @key {object} offerSearch - use user search key and region to create an offer search; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {object} userSearchConfigKey - user search key
                  * @key {object} region (opt) - search offers in the given region
              * @key {object} criteria (opt) - other search criteria
                  * @key {boolean} generateEmpty (opt) (API url parameter) - whether locations with no offer will be included in the result list
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createOfferSearch = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var functionName = 'createOfferSearch';
            var ajax = pobj.ajax || {};
// check mandatory fields start
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
// check mandatory fields end
            var offerSearch = pobj.offerSearch;
            var criteria = pobj.criteria;
            var obj = {
                type: 'POST',
                apiUrl: 'offersearches',
                urlParam: criteria,
                data: JSON.stringify(offerSearch),
                functionName: functionName + '()'
            };
            self.api($.extend(obj,ajax));
        };

        /**
          * @desc get offer search, API base path: /smp/api/offersearches, API full path: /smp/api/offersearches/{offerSearchKey}
          * @param {object} pobj
              * @key {string} offerSearchKey - offer search key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getOfferSearch = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var functionName = 'getOfferSearch';
            var ajax = pobj.ajax || {};
// check mandatory fields start
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
// check mandatory fields end
            var offerSearchKey = pobj.offerSearchKey;
            var obj = {
                type: 'GET',
                apiUrl: 'offersearches/' + offerSearchKey,
                functionName: functionName + '()'
            };
            self.api($.extend(obj,ajax));
        };

        /**
          * @desc get service by service ID, API base path: /smp/api/services/services, API full path: /smp/api/services/services/{id}
          * @param {object} pobj
              * @key {string} serviceId - ID of service
              * @key {object} criteria (opt) - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/
                  * @key {string} constructionTime (opt) (API url parameter) - construction time of the vehicle, in the format "YYYY-MM-DD" (or "YYYY-MM-01")
                  * @key {string} vehicleTypeId (opt) (API url parameter) - ID of vehicle type
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getServiceById = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var functionName = 'getServiceById';
            var ajax = pobj.ajax || {};
// check mandatory fields start
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
// check mandatory fields end
            var serviceId = pobj.serviceId;
            var criteria = pobj.criteria;
            var obj = {
                apiUrl: 'services/services/' + serviceId,
                urlParam: criteria,
                functionName: functionName + '()'
            };
            self.api($.extend(obj,ajax));
        };

        /**
          * @desc FG internal tracking, API base path: /smp/api/tracking/json, API full path: /smp/api/tracking/json
          * @param {object} pobj
              * @key {object} trackingData - The info summarizing the event to be tracked
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.track = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var functionName = 'track';
            var ajax = pobj.ajax || {};
// check mandatory fields start
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
// check mandatory fields end
            var trackingData = pobj.trackingData;
            var obj = {
                type: 'POST',
                apiUrl: 'tracking/json',
                data: JSON.stringify(trackingData),
                functionName: functionName + '()'
            };
            self.api($.extend(obj,ajax));
        };

        /**
          * @desc create user search, API base path: /smp/api/usersearches, API full path: /smp/api/usersearches
          * @param {object} pobj
              * @key {object} userSearch - use vehicle, and service to create a user search
                  * @key {object} selectedVehicle - selected vehicle
                  * @key {array of objects} selectedServiceList - list of selected services
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createUserSearch = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var functionName = 'createUserSearch';
            var ajax = pobj.ajax || {};
// check mandatory fields start
            var paramConfigs = [
                {
                    paramName: 'userSearch',
                    paramType: 'object'
                },{
                    paramName: 'selectedVehicle',
                    paramType: 'object',
                    parentObj: 'userSearch'
                },{
                    paramName: 'selectedServiceList',
                    paramType: 'array of objects',
                    parentObj: 'userSearch'
                }
            ];
            var paramsSetResult = self.areMandatoryParmsSet(functionName,pobj,paramConfigs);
            var areParamsSet = paramsSetResult[0];
            pobj = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
// check mandatory fields end
            var userSearch = pobj.userSearch;
            var obj = {
                type: 'POST',
                apiUrl: 'usersearches',
                data: JSON.stringify(userSearch),
                functionName: functionName + '()'
            };
            self.api($.extend(obj,ajax));
        };

        /**
          * @desc get user search, API base path: /smp/api/usersearches, API full path: /smp/api/usersearches/{userSearchKey}
          * @param {object} pobj
              * @key {string} userSearchKey - user search key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getUserSearch = function(pobj){
            if (typeof pobj === 'undefined') {
                pobj = {};
            }
            var functionName = 'getUserSearch';
            var ajax = pobj.ajax || {};
// check mandatory fields start
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
// check mandatory fields end
            var userSearchKey = pobj.userSearchKey;
            var obj = {
                type: 'GET',
                apiUrl: 'usersearches/' + userSearchKey,
                functionName: functionName + '()'
            };
            self.api($.extend(obj,ajax));
        };

        return self;
    };

})(jQuery);