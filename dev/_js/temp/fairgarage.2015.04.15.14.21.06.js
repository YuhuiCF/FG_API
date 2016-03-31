
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
            var url = ((self.properties.ssl == 'https' || self.properties.ssl == 'http') ? self.properties.ssl : '') + '//' + self.properties.env + self.properties.apiBase + (obj.url || 'authentication/login') + (varPrivate.sessionId ? ';jsessionid=' + varPrivate.sessionId : '') + ('?contextKey=' + self.properties.contextKey/* + '&languageCode=' + self.properties.languageCode*/);
            var forceNoSession = obj.forceNoSession ? true : false;
            //url = forceNoSession ? url : appendSession(url);
            var error = obj.error;
            
            var ajaxObj = {
                type: type,
                async: typeof obj.async == 'boolean' ? obj.async : (typeof self.properties.async == 'boolean' ? self.properties.async : true),
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
          * @desc find FairGarage agreements
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/ -> /smp/api/agreements --> /smp/api/agreements
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
                data: $.extend({providerId:1,isPublik:true},criteria),
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
          * @desc check login status
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
          * @desc login
          * @param object pobj
              * @param object loginData - data of login; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/ -> /smp/api/authentication/login --> /smp/api/authentication/login
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
          * @desc logout
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
          * @desc create/post context
          * @param object pobj
              * @param object context - context config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/ -> /smp/api/contexts --> /smp/api/contexts
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
                url: 'contexts',
                data: context,
                functionName: 'createContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete context
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
          * @desc find context
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/ -> /smp/api/contexts --> /smp/api/contexts
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
                data: criteria,
                functionName: 'findContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get context
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
          * @desc update/put context
          * @param object pobj
              * @param object context - context config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/ -> /smp/api/contexts --> /smp/api/contexts/{key}
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
                data: context,
                functionName: 'updateContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find country configuration
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/ -> /smp/api/countryconfig --> /smp/api/countryconfig
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
                data: criteria,
                functionName: 'findCountryConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get country configuration of the current context
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
          * @desc find mail configuration
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/ -> /smp/api/mailconfigs --> /smp/api/mailconfigs
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
                data: criteria,
                functionName: 'findMailConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find region
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/ -> /smp/api/regions --> /smp/api/regions
                  * @param (opt) string searchTerm - search term
              * @param (opt) function(data) quickHandle - quickHandle function with parameter (data) of type array of objects.
                    The structure of each object in parameter data:
                        formattedName - strings, formatted name of the region
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
                data: criteria,
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
          * @desc get region by region signature
          * @param object pobj
              * @param string signature - region signature
              * @param (opt) function(data) quickHandle - quickHandle function with parameter (data) of type object.
                    The structure of the parameter data:
                        formattedName - strings, formatted name of the region
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
          * @desc get region of the user
          * @param object pobj
              * @param (opt) function(data) quickHandle - quickHandle function with parameter (data) of type object.
                    The structure of the parameter data:
                        formattedName - strings, formatted name of the region
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
          * @desc register as individual FairGarage user. If this step is successful, the user will receive an email concerning setting the password, to complete the registration
          * @param object pobj
              * @param string registrationData - data of registration; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/ -> /smp/api/users --> /smp/api/users
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
          * @desc get vehicle by catalog
          * @param object pobj
              * @param string categoryId - vehicle category ID. To get IDs of the next category, start with "62303" for SUV/passenger cars, or "83503" for transporters
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/ -> /smp/api/vehicles/catalog --> /smp/api/vehicles/catalog/{vehicleCategoryId}
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
        self.getVehicleByCatalog = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax || {};
            var categoryId = pobj.categoryId;
            if (typeof categoryId == 'undefined') {
                self.error('Please indicate the "categoryId" of type string in function getVehicleByCatalog()');
                return;
            }
            var criteria = pobj.criteria;
            var quickHandle = pobj.quickHandle;
            var success = ajax.success;
            var obj = {
                url: 'vehicles/catalog/' + categoryId,
                data: criteria,
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
                functionName: 'getVehicleByCatalog()'
            };
            delete ajax.success;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc create webkit config
          * @param object pobj
              * @param object webkitConfig - webkit config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/ -> /smp/api/webkit/webkitconfigs --> /smp/api/webkit/webkitconfigs
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
                data: webkitConfig,
                functionName: 'createWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc delete webkit config
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
          * @desc find webkit config
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/ -> /smp/api/webkit/webkitconfigs --> /smp/api/webkit/webkitconfigs
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
                data: criteria,
                functionName: 'findWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc get webkit config
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
          * @desc update/put webkit config
          * @param object pobj
              * @param object webkitConfig - webkit config; for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/ -> /smp/api/webkit/webkitconfigs --> /smp/api/webkit/webkitconfigs
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
                data: webkitConfig,
                functionName: 'updateWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        return self;
    }
    
})(jQuery);