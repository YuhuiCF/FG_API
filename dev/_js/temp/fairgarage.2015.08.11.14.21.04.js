
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
            var url = (($.inArray(self.getProperty('ssl'),['http','https']) >= 0) ? self.getProperty('ssl') : 'http') + '://' + self.getProperty('env') + self.getProperty('apiBase') + (obj.apiUrl || 'authentication/login') + (varPrivate.sessionId ? ';jsessionid=' + varPrivate.sessionId : '') + ('?' + $.param($.extend({contextKey:self.getProperty('contextKey')},urlParam)));
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
        };
        
        /** 
          * @desc get booking version, API base path: /smp/api/bookings, API full path: /smp/api/bookings/{bookedOfferKey}/version
          * @param {object} pobj
              * @key {string} bookedOfferKey - booked offer key
              * @key {object} ajax (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.getBookingVersion = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var paramMissingHint = [];
            var ajax = pobj.ajax || {};
            var bookedOfferKey = pobj.bookedOfferKey;
            if (typeof bookedOfferKey == 'undefined') {
                paramMissingHint.push('"bookedOfferKey" of type "string"');
                bookedOfferKey = '';
            }
            if (paramMissingHint.length > 0) {
                self.error('Please indicate in function getBookingVersion(): ' + paramMissingHint.join(', '));
                return;
            }
            var obj = {
                apiUrl: 'bookings/' + bookedOfferKey + '/version',
                functionName: 'getBookingVersion()'
            };
            self.api($.extend(obj,ajax));
        };

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
                apiUrl: 'offers/' + offerKey,
                urlParam: criteria,
                functionName: 'getOffer()'
            };
            self.api($.extend(obj,ajax));
        };

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
        };

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
        };

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
        };

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
        };

        return self;
    };
    
})(jQuery);