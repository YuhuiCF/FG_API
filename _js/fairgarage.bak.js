
//TODO:
/*
    * var JSI should not be used in APIs with searchTerm --> use forceNoSession, and do not use JSI in url
    * when to remove sessionId, set it as private? (logout, and unfortunately expired)
    * when to put agreementId when login (MAZDA-11364)
    * show error if jQuery not present
*/

(function($){
    
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
                        self.error('Error in FairGarage API when trying to use function ' + functionName + ' and ' + type + ' for url: ' + url);
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
        
/*** authentication start ***/
        /** 
          * @desc check login status
          * @param object pobj
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten
        */
        self.checkLoginStatus = function(pobj){
            var ajax = pobj.ajax;
            var complete = pobj.ajax.complete;
            delete pobj.ajax.complete;
            
            var obj = {
                functionName: 'checkLoginStatus()',
                complete: function(jqXHR,textStatus){
                    var data = JSON.parse(jqXHR.responseText);
                    if (data.sessionId) {
                        self.setProperties({'sessionId':data.sessionId});
                    } else {
                        self.removeProperties(['sessionId']);
                    }
                    
                    if (typeof complete == 'function') {
                        complete(jqXHR,textStatus);
                    }
                }
            };
            
            self.api($.extend(obj,ajax));
        }
        
        /** 
          * @desc login
          * @param object pobj
              * @param string username - username
              * @param string password - password
              * @param function newAgreements - function, to display the new agreements whenever there is an update of them, with parameter (data) of type object.
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
              * @param (opt) array of strings agreementIds - agreement IDs
              * @param (opt) function quickHandle - quickHandle function with parameter (data) of type object.
                    The structure of parameter data:
                        authorities - array of strings, authorities of the user
                        emailAddress - string, email address of the user
                        givenname - string, given name of the user
                        middlename - string, middle name of the user
                        surname - string, surname of the user
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten
        */
        self.login = function(pobj){
            var username = pobj.username;
            var password = pobj.password;
            var newAgreements = pobj.newAgreements;
            var agreementIds = pobj.agreementIds;
            var quickHandle = pobj.quickHandle;
            var ajax = pobj.ajax;
            var success = pobj.ajax.success;
            delete ajax.success;
            var complete = pobj.ajax.complete;
            delete ajax.complete;
            
            if (typeof username == 'undefined' || typeof password == 'undefined') {
                return self.error('Please indicate your username and password');
            }
            if (typeof newAgreements == 'undefined') {
                return self.error('Please indicate the newAgreements() function');
            }
            
            self.setProperties({username:username});
            
            var loginData = {
                username: username,
                password: password,
                agreementVersions: []
            };
            if (typeof agreementIds != 'undefined') {
                $.each(agreementIds,function(){
                    loginData.agreementVersions.push({agreementId:this.toString()});
                });
            }
            
            var obj = {
                functionName: 'login()',
                type: 'PUT',
                data: JSON.stringify(loginData),
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
                },
                complete: function(jqXHR,textStatus){
                    var responseText = JSON.parse(jqXHR.responseText);
                    if (textStatus == 'error' && (responseText.agreementVersionsAdded || responseText.agreementVersionsUpdated)) {// treat new agreements
                        var newData = {
                            addedAgreements: [],
                            updatedAgreements: []
                        };
                        $.each(responseText.agreementVersionsAdded,function(){
                            newData.addedAgreements.push({
                                id: this.agreementId,
                                title: this.title,
                                htmlText: this.text
                            });
                        });
                        $.each(responseText.agreementVersionsUpdated,function(){
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
                                agreementIds: newData.addedAgreements.concat(newData.updatedAgreements),
                            };
                            if (typeof quickHandle == 'function') {
                                obj.quickHandle = quickHandle();
                            }
                            if (typeof complete == 'function') {
                                obj.complete = complete(jqXHR,textStatus);
                            }
                            
                            self.login(obj);
                        }
                        
                        newAgreements(newData);
                    }
                    if (typeof complete == 'function') {
                        complete(jqXHR,textStatus);
                    }
                }
            };
            
            self.api($.extend(obj,ajax));
        }
        
        /** 
          * @desc logout
          * @param object pobj
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten
        */
        self.logout = function(pobj){
            var ajax = pobj.ajax;
            delete ajax.error;
            
            var obj = {
                functionName: 'logout()',
                type: 'PUT',
                url: 'authentication/logout' + JSI + '?',
                error: function(){}
            };
            
            self.api($.extend(obj,ajax));
        }
/*** authentication end ***/


/*** contexts start ***/
        /** 
          * @desc get context
          * @param object pobj
              * @param string contextKey - context key
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten
        */
        self.getContext = function(pobj){
            var contextKey = pobj.contextKey;
            var ajax = pobj.ajax;
            
            if (typeof contextKey == 'undefined') {
                self.error('Please indicate the contextKey');
            }
            
            var obj = {
                functionName: 'getContext()',
                url: 'contexts/' + contextKey + JSI + '?'
            };
            
            self.api($.extend(obj,ajax));
        }
        
        /** 
          * @desc post context
          * @param object pobj
              * @param obj context - context config
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten
        */
        self.postContext = function(pobj){
            var context = pobj.context;
            var ajax = pobj.ajax;
            
            if (typeof context == 'undefined') {
                self.error('Please indicate the context');
            }
            
            var obj = {
                functionName: 'postContext()',
                type: 'POST',
                url: 'contexts' + JSI + '?',
                data: JSON.stringify(context)
            };
            
            self.api($.extend(obj,ajax));
        }
        
        /** 
          * @desc put context
          * @param object pobj
              * @param obj context - context config
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten
        */
        self.putContext = function(pobj){
            var context = pobj.context;
            var ajax = pobj.ajax;
            
            if (typeof context == 'undefined') {
                self.error('Please indicate the context');
            }
            
            var obj = {
                functionName: 'putContext()',
                type: 'PUT',
                url: 'contexts/' + context.key + JSI + '?',
                data: JSON.stringify(context)
            };
            
            self.api($.extend(obj,ajax));
        }
/*** contexts end ***/


/*** providers start ***/
        /** 
          * @desc get context
          * @param object pobj
              * @param string contextKey - context key
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten
        */
/*** providers end ***/

        
/*** webkit start ***/
        /** 
          * @desc find webkit config
          * @param object pobj
              * @param (opt) number limit - limit
              * @param (opt) number locationId - location ID
              * @param (opt) number offset - offset
              * @param (opt) number providerId - provider ID
              * @param (opt) string regionSignature - region signature
              * @param (opt) boolean superseded - superseded
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten
        */
        self.findWebkitConfig = function(pobj){
            var ajax = pobj.ajax;
            
            var data = pobj;
            delete data.ajax;
            
            var obj = {
                functionName: 'findWebkitConfig()',
                url: 'webkit/webkitconfigs' + JSI + '?',
                data: data
            };
            
            self.api($.extend(obj,ajax));
        }
        
        /** 
          * @desc get webkit config
          * @param object pobj
              * @param string webkitConfigKey - webkit config key
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten
        */
        self.getWebkitConfig = function(pobj){
            var webkitConfigKey = pobj.webkitConfigKey;
            var ajax = pobj.ajax;
            
            if (typeof webkitConfigKey == 'undefined') {
                return self.error('Please indicate the webkitConfigKey')
            }
            
            var obj = {
                functionName: 'getWebkitConfig()',
                url: 'webkit/webkitconfigs/' + webkitConfigKey + JSI + '?'
            };
            
            self.api($.extend(obj,ajax));
        }
        
        /** 
          * @desc post webkitConfig
          * @param object pobj
              * @param obj webkitConfig - webkit config
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten
        */
        self.postWebkitConfig = function(pobj){
            var webkitConfig = pobj.webkitConfig;
            var ajax = pobj.ajax;
            
            if (typeof webkitConfig == 'undefined') {
                self.error('Please indicate the webkitConfig');
            }
            
            var obj = {
                functionName: 'postWebkitConfig()',
                type: 'POST',
                url: 'webkit/webkitconfigs' + JSI + '?',
                data: JSON.stringify(webkitConfig)
            };
            
            self.api($.extend(obj,ajax));
        }
        
        /** 
          * @desc put webkitConfig
          * @param object pobj
              * @param obj webkitConfig - webkit config
              * @param (opt) object ajax - key/value pairs of jQuery ajax() to be added/overwritten
        */
        self.putWebkitConfig = function(pobj){
            var webkitConfig = pobj.webkitConfig;
            var ajax = pobj.ajax;
            
            if (typeof webkitConfig == 'undefined') {
                self.error('Please indicate the webkitConfig');
            }
            
            var obj = {
                functionName: 'putWebkitConfig()',
                type: 'PUT',
                url: 'webkit/webkitconfigs/' + webkitConfig.key + JSI + '?',
                data: JSON.stringify(webkitConfig)
            };
            
            self.api($.extend(obj,ajax));
        }
/*** webkit end ***/


        return self;
    }
    
})(jQuery);
