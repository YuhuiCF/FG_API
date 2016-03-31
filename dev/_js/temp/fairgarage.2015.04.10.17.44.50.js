
(function($){
    
    console = window.console || {};
    console.error = window.console.error || function(){};

    window.fg = function(fgObj){
        var self = {};
        var JSI = 'JSI';
        
        self.properties = {
            ssl: '',
            env: 'api',
            apiBase: '.fairgarage.de/smp/api/',
            languageCode: 'de'
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
            var url = ((self.properties.ssl == 'https' || self.properties.ssl == 'http') ? self.properties.ssl : '') + '//' + self.properties.env + self.properties.apiBase + (obj.url || 'authentication/login' + JSI + '?') + ('contextKey=' + self.properties.contextKey + '&languageCode=' + self.properties.languageCode);
            var forceNoSession = obj.forceNoSession ? true : false;
            url = forceNoSession ? url : appendSession(url);
            var error = obj.error;
            
            function appendSession(str){
                if (self.properties.sessionId) {
                    str = str.replace(JSI,';jsessionid='+self.properties.sessionId);
                } else {
                    str = str.replace(JSI,'');
                }
                return str;
            }
            
            var ajaxObj = {
                type: type,
                async: typeof obj.async == 'boolean' ? obj.async : (typeof self.properties.async == 'boolean' ? self.properties.async : true),
                cache: obj.cache || false,
                url: url,
                contentType: obj.contentType || 'application/json;charset=UTF-8',
                dataType: obj.dataType || 'json',
                data: obj.data || '',
                error: typeof error == 'function' ? function(jqXHR,textStatus,errorThrown){error(jqXHR,textStatus,errorThrown);} : (typeof self.properties.error == 'function' ? self.properties.error : function(jqXHR){
                    try {
                        self.error('Network Error: ' + textStatus + ', ' + jqXHR.responseJSON[0].errorMessage);
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
          * @desc check login status
          * @param object pobj
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.checkLoginStatus = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax;
            var complete = ajax.complete;
            var obj = {
                complete: function(jqXHR,textStatus){
                    var data = jqXHR.responseJSON;
                    if (data.sessionId) {
                        self.setProperties({'sessionId':data.sessionId});
                    } else {
                        self.removeProperties(['sessionId']);
                    }
                    if (typeof complete == 'function') {
                        complete(jqXHR,textStatus);
                    }
                },
                functionName: 'checkLoginStatus()'
            };
            delete ajax.complete;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc login
          * @param object pobj
              * @param object loginData - data of login; for more details, please refer to description in http://www.fairgarage.de/smp/apitester/
                  * @param string username - username
                  * @param string password - password
                  * @param (opt) array of objects agreementVersions - agreement versions
                        an agreement version is in the form {agreementId: 'agreementId'}
              * @param function(data) newAgreements - to display the new agreements whenever there is an update of them, with parameter (data) of type object.
                    The structure of parameter data:
                        addedAgreements - array of objects, agreements to be added
                            id - string, ID of the corresponding agreement
                            title - string, title of the corresponding agreement
                            htmlText - string, html text of the corresponding agreement
                        updatedAgreements - array of objects, agreements to be updated
                            id - string, ID of the corresponding agreement
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
            var ajax = pobj.ajax;
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
            var obj = {
                data: JSON.stringify(loginData),
                type: 'PUT',
                success: function(data){
                    self.setProperties({sessionId: data.user.sessionId});
                    
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
                    
                    if (typeof quickHandle == 'function') {
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
                        $.each(data.agreementVersionsAdded,function(){
                            newData.addedAgreements.push({
                                id: this.agreementId,
                                title: this.title,
                                htmlText: this.text
                            });
                        });
                        $.each(data.agreementVersionsUpdated,function(){
                            newData.updatedAgreements.push({
                                id: this.agreementId,
                                title: this.title,
                                htmlText: this.text
                            });
                        });
                        newData.loginAgain = function(){
                            var obj = {
                                username: username,
                                password: password,
                                newAgreements: newAgreements(),
                                agreementVersions: newData.addedAgreements.concat(newData.updatedAgreements),
                            };
                            if (typeof quickHandle == 'function') {
                                obj.quickHandle = quickHandle();
                            }
                            self.login(obj);
                        }
                        
                        newAgreements(newData);
                    }
                    if (typeof complete == 'function') {
                        complete(jqXHR,textStatus);
                    }
                },
                functionName: 'login()'
            };
            delete ajax.data;
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
            var ajax = pobj.ajax;
            var error = ajax.error;
            var obj = {
                type: 'PUT',
                url: 'authentication/logout' + JSI + '?',
                error: function(jqXHR,textStatus,errorThrown){
                    if (typeof error == 'function') {
                        error(jqXHR,textStatus,errorThrown);
                    }
                },
                functionName: 'logout()'
            };
            delete ajax.error;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc create/post context
          * @param object pobj
              * @param object context - context config
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createContext = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax;
            var context = pobj.context;
            if (typeof context == 'undefined') {
                self.error('Please indicate the "context" of type object in function createContext()');
                return;
            }
            var obj = {
                url: 'contexts' + JSI + '?',
                data: context,
                functionName: 'createContext()'
            };
            delete ajax.data;
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
            var ajax = pobj.ajax;
            var contextKey = pobj.contextKey;
            if (typeof contextKey == 'undefined') {
                self.error('Please indicate the "contextKey" of type string in function deleteContext()');
                return;
            }
            var obj = {
                url: 'contexts/' + contextKey + JSI + '?',
                type: 'DELETE',
                functionName: 'deleteContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find context
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to description in http://www.fairgarage.de/smp/apitester/
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
            var ajax = pobj.ajax;
            var criteria = pobj.criteria;
            var obj = {
                url: 'contexts' + JSI + '?',
                data: criteria,
                functionName: 'findContext()'
            };
            delete ajax.data;
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
            var ajax = pobj.ajax;
            var contextKey = pobj.contextKey;
            if (typeof contextKey == 'undefined') {
                self.error('Please indicate the "contextKey" of type string in function getContext()');
                return;
            }
            var obj = {
                url: 'contexts/' + contextKey + JSI + '?',
                functionName: 'getContext()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc update/put context
          * @param object pobj
              * @param object context - context config
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateContext = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax;
            var context = pobj.context;
            if (typeof context == 'undefined') {
                self.error('Please indicate the "context" of type object in function updateContext()');
                return;
            }
            var obj = {
                type: 'PUT',
                url: 'contexts/' + context.key + JSI + '?',
                data: context,
                functionName: 'updateContext()'
            };
            delete ajax.data;
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc create webkit config
          * @param object pobj
              * @param object webkitConfig - webkit config; for more details, please refer to description in http://www.fairgarage.de/smp/apitester/
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.createWebkitConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax;
            var webkitConfig = pobj.webkitConfig;
            if (typeof webkitConfig == 'undefined') {
                self.error('Please indicate the "webkitConfig" of type object in function createWebkitConfig()');
                return;
            }
            var obj = {
                url: 'webkit/webkitconfigs' + JSI + '?',
                data: webkitConfig,
                functionName: 'createWebkitConfig()'
            };
            delete ajax.data;
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
            var ajax = pobj.ajax;
            var webkitConfigKey = pobj.webkitConfigKey;
            if (typeof webkitConfigKey == 'undefined') {
                self.error('Please indicate the "webkitConfigKey" of type string in function deleteWebkitConfig()');
                return;
            }
            var obj = {
                url: 'webkit/webkitconfigs/' + webkitConfigKey + JSI + '?',
                type: 'DELETE',
                functionName: 'deleteWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc find webkit config
          * @param object pobj
              * @param (opt) object criteria - search criteria; for more details, please refer to description in http://www.fairgarage.de/smp/apitester/
                  * @param (opt) number limit - limit
                  * @param (opt) number locationId - location ID
                  * @param (opt) number offset - offset
                  * @param (opt) number providerId - provider ID
                  * @param (opt) string regionSignature - region signature
                  * @param (opt) boolean superseded - superseded
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.findWebkitConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax;
            var criteria = pobj.criteria;
            var obj = {
                url: 'webkit/webkitconfigs' + JSI + '?',
                data: criteria,
                functionName: 'findWebkitConfig()'
            };
            delete ajax.data;
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
            var ajax = pobj.ajax;
            var webkitConfigKey = pobj.webkitConfigKey;
            if (typeof webkitConfigKey == 'undefined') {
                self.error('Please indicate the "webkitConfigKey" of type string in function getWebkitConfig()');
                return;
            }
            var obj = {
                url: 'webkit/webkitconfigs/' + webkitConfigKey + JSI + '?',
                functionName: 'getWebkitConfig()'
            };
            self.api($.extend(obj,ajax));
        }

        /** 
          * @desc update/put webkit config
          * @param object pobj
              * @param object webkitConfig - webkit config; for more details, please refer to description in http://www.fairgarage.de/smp/apitester/
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        self.updateWebkitConfig = function(pobj){
            if (typeof pobj == 'undefined') {
                pobj = {};
            }
            var ajax = pobj.ajax;
            var webkitConfig = pobj.webkitConfig;
            if (typeof webkitConfig == 'undefined') {
                self.error('Please indicate the "webkitConfig" of type object in function updateWebkitConfig()');
                return;
            }
            var obj = {
                url: 'webkit/webkitconfigs/' + webkitConfig.key + JSI + '?',
                type: 'PUT',
                data: webkitConfig,
                functionName: 'updateWebkitConfig()'
            };
            delete ajax.data;
            self.api($.extend(obj,ajax));
        }

        return self;
    }
    
})(jQuery);