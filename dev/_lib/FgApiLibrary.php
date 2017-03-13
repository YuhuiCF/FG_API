
<?php
/*

* add API property for API functions, and extend it for spcific uses. E.g. location user login, either use authToken, or the standard way
* add more standard variable descriptions, if possible create for all
* use library independent function? -> each(), ajax(), find(), etc.
* use same names as BE?

*/
class FgApiLibrary{
    public $outputObj = 'self';
    public $varPrivate = 'varPrivate';
    public $sessionId = 'sessionId';
    public $properties = 'properties';
    public $defaultValue = 'defaultValue';
    public $paramSaveVehicle = 'saveVehicle'; // saveVehicle function parameter in some functions
    public $tab = '    ';
    public $functionParamObj = 'pobj';
    public $ajaxParamName = 'ajax';
    public $missingMandatoryParams = 'missingMandatoryParams';

    public $functionAreMandatoryParmsSet = 'areMandatoryParmsSet';
    public $functionDateToTimestamp = 'dateToTimestamp';
    public $functionFindAgreement = 'findAgreement'; // -> agreements.findAgreement.php
    public $functionFindCountryConfig = 'findCountryConfig'; // -> countryconfig.findCountryConfig.php
    public $functionGetFirstDateInConstructionTimeMap = 'getFirstDateInConstructionTimeMap';
    public $functionGetProperty = 'getProperty';
    public $functionGetVehicleByVehicleTypeId = 'getVehicleByVehicleTypeId'; // -> vehicles.getVehicleByVehicleTypeId.php
    public $functionQuickHandle = 'quickHandle';
    public $functionRemoveProperties = 'removeProperties';
    public $functionSetProperties = 'setProperties';
    public $functionTimestampToDate = 'timestampToDate';

    public $countryCodeHint = '';
    public $languageCodeHint = '';

    public $agreementIdHint = 'ID of the agreement';
    public $apitesterHint = 'for more details, please refer to the description in http://www.fairgarage.de/smp/apitester/';
    public $bookedOfferKeyHint = 'key of booked offer';
    public $constructionTimeHint = 'construction time of the vehicle, fairgarageDateHint';
    public $contextHint = 'context key';
    public $fairgarageDateHint = 'in the UTC milliseconds format';
    public $limitHint = 'number of the results';
    public $locationIdHint = 'ID of location';
    public $offsetHint = 'offset of the results';
    public $serviceIdHint = 'ID of service';
    public $vehicleTypeIdHint = 'ID of vehicle type';

    public $semiMandatoryValueHint = 'if not set, default value would be ';

    public $outputFunctions = '';
    public $libraryStartString = '';
    public $libraryEndString = '';

    function setDescription($description,$semiMandatoryDefaultValue){
        if (preg_match('/agreementIdHint|apitesterHint|bookedOfferKeyHint|contextHint|constructionTimeHint|countryCodeHint|fairgarageDateHint|languageCodeHint|limitHint|locationIdHint|offsetHint|semiMandatoryValueHint|serviceIdHint|vehicleTypeIdHint/',$description)) {
            return
                $this -> setDescription(
                    preg_replace('/agreementIdHint/', $this -> agreementIdHint,
                    preg_replace('/apitesterHint/', $this -> apitesterHint,
                    preg_replace('/bookedOfferKeyHint/', $this -> bookedOfferKeyHint,
                    preg_replace('/contextHint/', $this -> contextHint,
                    preg_replace('/constructionTimeHint/', $this -> constructionTimeHint,
                    preg_replace('/countryCodeHint/', $this -> countryCodeHint,
                    preg_replace('/fairgarageDateHint/', $this -> fairgarageDateHint,
                    preg_replace('/languageCodeHint/', $this -> languageCodeHint,
                    preg_replace('/limitHint/', $this -> limitHint,
                    preg_replace('/locationIdHint/', $this -> locationIdHint,
                    preg_replace('/offsetHint/', $this -> offsetHint,
                    preg_replace('/semiMandatoryValueHint/', $this -> semiMandatoryValueHint.$semiMandatoryDefaultValue,
                    preg_replace('/serviceIdHint/', $this -> serviceIdHint,
                    preg_replace('/vehicleTypeIdHint/', $this -> vehicleTypeIdHint, $description)))))))))))))),
                    $semiMandatoryDefaultValue
                );
        } else {
            return $description;
        }
    }

    function FgApiLibrary($jsHelperFile = './_modules/jsHelper.js'){

        $this -> countryCodeHint = 'country code; "DE", "GB", "PL", or other country codes that can be found by function '.$this -> functionFindCountryConfig.'()';
        $this -> languageCodeHint = 'language code; "de", "en", "pl", or other language codes that can be found by function '.$this -> functionFindCountryConfig.'()';

        $this -> libraryStartString = "
(function($){

    var console = window.console || {};
    console.error = window.console.error || function(){};

    window.fg = function(fgObj){
        var ".$this -> outputObj." = {};
        var ".$this -> varPrivate." = {};

        ".$this -> outputObj.".".$this -> properties." = {
            ssl: 'https',
            env: 'api',
            apiBase: '.fairgarage.de/smp/api/',
            languageCode: 'de',
            countryCode: 'DE'
        };

        // fake lodash/underscore javascript helper library
        var helper = ". file_get_contents($jsHelperFile) ."

        /**
          * @desc set properties in ".$this -> outputObj.".".$this -> properties."
          * @param {object} newProperties - object with new properties to be added/modified
              * @key {string} apiBase - base URL of FairGarage API, default value is '.fairgarage.de/smp/api/'
              * @key {string} contextKey - context key used in FairGarage API
              * @key {string} countryCode - ".$this -> countryCodeHint.", default value 'DE'
              * @key {string} env - environment of FairGarage API, default value is 'api'
              * @key {function} error - default error function to be used in FairGarage API
              * @key {string} languageCode - ".$this -> languageCodeHint.", default value 'de'
              * @key {string} ssl - 'https' (default) or 'http'
              * @key {object} selectedVehicle - the vehicle object used in FairGarage API. It has 3 keys:
                    @key {object} constructionTime: the construction time object has one key, 'time', which stores the timestamp of the construction time of the vehicle. The value could be automatically saved, if ".$this -> paramSaveVehicle." in the corresponding functions is set to true.
                    @key {array of objects} equipmentList: each object of the list is a FairGarage equipment object
                    @key {object} vehicleType: the FairGarage vehicle object
        */
        ".$this -> outputObj.".".$this -> functionSetProperties." = function(newProperties){
            extend(".$this -> outputObj.".".$this -> properties.",newProperties);
        };
        ".$this -> outputObj.".".$this -> functionSetProperties."(fgObj);

        /**
          * @desc get property in ".$this -> outputObj.".".$this -> properties."
          * @param {string} propertyName - object with new properties to be added/modified
          * @return the value of the property, otherwise null, if propertyName not defined
        */
        ".$this -> outputObj.".".$this -> functionGetProperty." = function(propertyName){
            return ".$this -> outputObj.".".$this -> properties."[propertyName];
        };

        /**
          * @desc remove properties in ".$this -> outputObj.".".$this -> properties."
          * @param {array of strings} properties - array with names of properties to be added/modified in ".$this -> outputObj.".".$this -> properties."
        */
        ".$this -> outputObj.".".$this -> functionRemoveProperties." = function(properties){
            helper.each(properties,function(property){
                delete ".$this -> outputObj.".properties[property];
            });
        };

        /**
          * @desc ajax request
          * @param {object} obj - obj for jQuery ajax() function,
                                    except modifications in \"url\", \"error\"
        */
        ".$this -> outputObj.".api = function(obj){
            var functionName = obj.functionName || 'api';
            var type = obj.type || 'GET';
            var urlParam = obj.urlParam || {};
            var url = (($.inArray(".$this -> outputObj.".".$this -> functionGetProperty."('ssl'),['http','https']) >= 0) ? ".$this -> outputObj.".".$this -> functionGetProperty."('ssl') : 'https') + '://' + ".$this -> outputObj.".".$this -> functionGetProperty."('env') + ".$this -> outputObj.".".$this -> functionGetProperty."('apiBase') + (obj.apiUrl || 'authentication/current') + (".$this -> varPrivate.".sessionId ? ';jsessionid=' + ".$this -> varPrivate.".sessionId : '') + ('?' + $.param(extend({contextKey:".$this -> outputObj.".".$this -> functionGetProperty."('contextKey')},urlParam)));
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
                    ".$this -> outputObj.".error('Network Error: ' + textStatus + ', ' + errorThrown + '. ' + errMsg.join('; '));
                } catch (err) {
                    ".$this -> outputObj.".error('Error in FairGarage API when trying to use function ' + functionName + '()');
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
        ".$this -> outputObj.".error = function(str){
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
        ".$this -> outputObj.".".$this -> functionGetFirstDateInConstructionTimeMap." = function(constructionTimeMap){
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
        ".$this -> outputObj.".".$this -> functionDateToTimestamp." = function(date){
            if (!(/\d{4}\-\d{2}\-01/.test(date) || /\d{4}\-\d{1}\-01/.test(date))) {
                return ".$this -> outputObj.".error('Please write the date in the format YYYY-MM-01, e.g. \"2008-01-01\"');
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
        ".$this -> outputObj.".".$this -> functionTimestampToDate." = function(timestamp){
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
        ".$this -> outputObj.".".$this -> functionAreMandatoryParmsSet." = function(functionName,".$this -> functionParamObj.",paramConfigs){
            var missingMandatoryParams = [];
            helper.each(paramConfigs,function(config, i){
                var paramName = config.paramName;//string
                var paramType = config.paramType;//string
                var parentObj = config.parentObj;//string
                var defaultValue = config.defaultValue;
                var isMissing = false;
                if (isType(".$this -> functionParamObj."[parentObj],'undefined')) {// this is the parent object
                    if (isType(".$this -> functionParamObj."[paramName],'undefined')) {// this parameter is not given
                        if (!isType(defaultValue,'undefined')) {// default value is given
                            ".$this -> functionParamObj."[paramName] = defaultValue;
                        } else {// default value is not given
                            if (paramType === 'object') {// set empty object, such that its mandatory fields would be indicated
                                ".$this -> functionParamObj."[paramName] = {};
                            }
                            isMissing = true;
                        }
                    }
                } else {// this is a field of the parent object
                    if (isType(".$this -> functionParamObj."[parentObj][paramName],'undefined')) {// this parameter is not given
                        if (!isType(defaultValue,'undefined')) {// default value is given
                            ".$this -> functionParamObj."[paramName] = defaultValue;
                        } else {// default value is not given
                            isMissing = true;
                        }
                    }

                }
                if (isMissing) {
                    missingMandatoryParams.push('\"' + ".'paramName'." + '\" of type "."\"' + paramType + '\"' + (isType(parentObj,'undefined') ? '' : ' in \"' + parentObj + '\"' ));
                }
            });
            if (missingMandatoryParams.length > 0) {
                self.error('Please indicate in function ' + functionName + '(): ' + missingMandatoryParams.join(', '));
                return [false,".$this -> functionParamObj."];
            } else {
                return [true,".$this -> functionParamObj."];
            }
        };
";

        $this -> libraryEndString = "
        return ".$this -> outputObj.";
    };

})(jQuery);";

    }

    function addFunction($obj){
        $functionName = $obj['functionName'];
        $description = $obj['description'];
		$basePath = (isset($obj['basePath']) ? $obj['basePath'] : NULL);
		$fullPath = (isset($obj['fullPath']) ? $obj['fullPath'] : NULL);
		$storeArgumentsAs = (isset($obj['storeArgumentsAs']) ? $obj['storeArgumentsAs'] : NULL);
		$functionParams = (isset($obj['functionParams']) ? $obj['functionParams'] : NULL);
		$ajaxDefaultParams = (isset($obj['ajaxDefaultParams']) ? $obj['ajaxDefaultParams'] : NULL);

        $hasMandatoryParams = false;
        $isDataDefined = false;
        $isDataMandatory = false;
        $isUrlParamDefined = false;
        $isUrlParamMandatory = false;

        $ajaxCheckKeys = array();
        $parametersInUrl = array();
        $parametersInUrlParam = array();
        $parametersInData = array();
        $parametersInSuccess = array();
        $parametersInError = array();
        $parametersInComplete = array();

        $ajaxParamToBeDeleted = array();

        // function description start
        $this -> outputFunctions.= "
        "."/**
          * @desc ".$description.($basePath && $fullPath ? ", API base path: ".$basePath.", API full path: ".$fullPath : "")."
          * @param {object} ".$this -> functionParamObj;

        $temp = '';
        $tempMandatory = array();

        if ($functionParams) {
            foreach ($functionParams as $param) {
                $parameterName = $param['parameterName'];
                $type = $param['type'];
                $description = $param['description'];
                $semiMandatoryDefaultValue = (isset($param['semiMandatoryDefaultValue']) ? $param['semiMandatoryDefaultValue'] : NULL);
                $isMandatory = ($semiMandatoryDefaultValue ? true : (isset($param['isMandatory']) ? $param['isMandatory'] : NULL));
                if ($isMandatory === true) {
                    $hasMandatoryParams = true;
                }
                $isAjaxDataKey = (isset($param['isAjaxDataKey']) ? $param['isAjaxDataKey'] : NULL);
                $isUrlParamKey = (isset($param['isUrlParamKey']) ? $param['isUrlParamKey'] : NULL);
                if ($isAjaxDataKey && $isUrlParamKey) {
                    trigger_error('isAjaxDataKey and isUrlParamKey should not be set as true at the same time.', E_USER_ERROR);
                }
                $ajaxCheck = (isset($param['ajaxCheck']) ? $param['ajaxCheck'] : NULL);
                if (is_string($ajaxCheck)) {
                    $ajaxCheck = array($ajaxCheck);
                }
                if ($ajaxCheck && in_array('data', $ajaxCheck) && !$isAjaxDataKey) {
                    $dataParamName = $parameterName;
                    $isDataMandatory = $isMandatory;
                }
                if ($ajaxCheck && in_array('urlParam', $ajaxCheck) && !$isUrlParamKey) {
                    $urlParamName = $parameterName;
                    $isUrlParamMandatory = $isMandatory;
                }
                $this -> outputFunctions.= "
              "
/*
display one of the @key line, but not for the ajax object:
              * @key XXX
or
                  * @key XXX
*/
                .($isAjaxDataKey || $isUrlParamKey ? $this -> tab : "")."* @key {".$type."} ".$parameterName." ".($isMandatory ? "" : "(opt) ").($isUrlParamKey ? "(API url parameter) " : "")."- ".$this -> setDescription($description,$semiMandatoryDefaultValue);

                if ($isAjaxDataKey) {// is a key of ajax.data
                    if ($isDataMandatory && $isMandatory) {// and it is mandatory
                        if (!$isDataDefined) {
                            trigger_error('Please define the data before defining the data keys for '.$functionName.'.', E_USER_ERROR);
                        }
/*
test mandatory fields for ajax.data fields
*/
                        array_push($tempMandatory, "{
                    paramName: '".$parameterName."',
                    paramType: '".$type."',".($semiMandatoryDefaultValue ? "
                    defaultValue: ".$semiMandatoryDefaultValue."," : "")."
                    parentObj: '".$dataParamName."'
                }");
                /*

            if (typeof ".$dataParamName.".".$parameterName." !== 'undefined') {
                ".($semiMandatoryDefaultValue ? "var ".$this -> defaultValue." = ".$semiMandatoryDefaultValue.";
                if (typeof ".$this -> defaultValue." === 'undefined') {
                    ".$dataParamName.".".$parameterName." = ".$this -> defaultValue.";
                } else {
                    " : "").$this -> missingMandatoryParams.".push('\"".$parameterName."\" of type \"".$type."\" in \"".$dataParamName."\"');
                ".($semiMandatoryDefaultValue ? "}" : "")."
            }
                */
                    }
                } else {
                    if ($isUrlParamKey) {// is a key of url parameter
                        if ($isUrlParamMandatory && $isMandatory) {// and it is mandatory
                            if (!$isUrlParamDefined) {
                                trigger_error('Please define the data before defining the data keys for '.$functionName.'.', E_USER_ERROR);
                            }
/*
test mandatory URL parameters
*/
                            array_push($tempMandatory, "{
                    paramName: '".$parameterName."',
                    paramType: '".$type."',".($semiMandatoryDefaultValue ? "
                    defaultValue: ".$semiMandatoryDefaultValue."," : "")."
                    parentObj: '".$urlParamName."'
                }");
/*
                            $tempMandatory.= "
            if (typeof ".$urlParamName.".".$parameterName." === 'undefined') {
                ".$this -> missingMandatoryParams.".push('\"".$parameterName."\" of type \"".$type."\" in \"".$urlParamName."\"');
            }";
*/
                        }
                    } else {// general case
                        $temp.= "
            var ".$parameterName." = ".($semiMandatoryDefaultValue ? "!isType(".$this -> functionParamObj.".".$parameterName.",'undefined') ? ".$this -> functionParamObj.".".$parameterName." : ".$semiMandatoryDefaultValue : $this -> functionParamObj.".".$parameterName).";";
                        if ($isMandatory) {
                            array_push($tempMandatory, "{
                    paramName: '".$parameterName."',
                    paramType: '".$type."'
                }");
/*
                            $temp.= "
            if (typeof ".$parameterName." === 'undefined') {
                ".$this -> missingMandatoryParams.".push('\"".$parameterName."\" of type \"".$type."\"');
                ".$parameterName." = ";
                            switch ($type) {
                                case "array":
                                    $temp.= "[]";
                                    break;
                                case "object":
                                    $temp.= "{}";
                                    break;
                                case "string":
                                    $temp.= "''";
                                    break;
                                default:
                                    $temp.= "''";
                                    break;
                            }
                            $temp.= ";
            }";
*/
                        }

                        if ($ajaxCheck) {
                            foreach ($ajaxCheck as $ajaxParam) {
                                $key = array_search($ajaxParam, $ajaxCheckKeys);
                                if ($key === false) {
                                    array_push($ajaxCheckKeys, $ajaxParam);
                                }
                                switch ($ajaxParam) {
                                    case 'apiUrl':
                                        array_push($parametersInUrl, $parameterName);
                                        break;
                                    case 'urlParam':
                                        array_push($parametersInUrlParam, $parameterName);
                                        $isUrlParamDefined = true;
                                        break;
                                    case 'data':
                                        array_push($parametersInData, $parameterName);
                                        $isDataDefined = true;
                                        break;
                                    case 'error':
                                        array_push($parametersInError, $parameterName);
                                        break;
                                    case 'success':
                                        array_push($parametersInSuccess, $parameterName);
                                        break;
                                    case 'complete':
                                        array_push($parametersInComplete, $parameterName);
                                        break;
                                    default:
                                        trigger_error('ajaxCheck with value "'.$ajaxParam.'" has not been defined in the FgApiLibrary, please add it.', E_USER_ERROR);
                                        break;
                                }
                            }
                        }
                    }
                }
            }
        }

        // function description end, and function start
        $this -> outputFunctions.= "
              * @key {object} ".$this -> ajaxParamName." (opt) - key/value pairs of jQuery ajax() to be added/overwritten, if allowed
        */
        ".$this -> outputObj .".".$functionName." = function(".$this -> functionParamObj."){
            if (isType(".$this -> functionParamObj.",'undefined')) {
                ".$this -> functionParamObj." = {};
            }
            var functionName = '".$functionName."';
            var ".$this -> ajaxParamName." = ".$this -> functionParamObj.".".$this -> ajaxParamName." || {};";

        // mandatory fields in function parameters
            /*
            if (".$this -> missingMandatoryParams.".length > 0) {
                ".$this -> outputObj.".error('Please indicate in function ".$functionName."(): ' + ".$this -> missingMandatoryParams.".join(', '));
                return;
            }
            */
        if ($hasMandatoryParams) {
            $this -> outputFunctions.= "
            //----- check mandatory fields start
            var paramConfigs = [
                ".implode(",",$tempMandatory)."
            ];
            var paramsSetResult = ".$this -> outputObj.".".$this -> functionAreMandatoryParmsSet."(functionName,".$this -> functionParamObj.",paramConfigs);
            var areParamsSet = paramsSetResult[0];
            ".$this -> functionParamObj." = paramsSetResult[1];
            if (!areParamsSet){
                return;
            }
            //----- check mandatory fields end";
        }

        // set function parameters
        $this -> outputFunctions.= $temp;

        // get ajax parameters
        $temp = '';
        if ($ajaxDefaultParams) {
            foreach ($ajaxDefaultParams as $ajaxParamName => $ajaxParamValue) {
                if ($ajaxParamName && $ajaxParamValue) {
                    $mergeAjaxParams = false;
                    $arrayCheck = array();
                    $key = array_search($ajaxParamName, $ajaxCheckKeys);
                    if ($key !== false) {
                        unset($ajaxCheckKeys[$key]);
                    }
                    switch ($ajaxParamName) {
                        case 'apiUrl':
                            $arrayCheck = $parametersInUrl;
                            break;
                        case 'urlParam':
                            $arrayCheck = $parametersInUrlParam;
                            break;
                        case 'data':
                            $arrayCheck = $parametersInData;
                            break;
                        case 'error':
                            $arrayCheck = $parametersInError;
                            break;
                        case 'success':
                            $arrayCheck = $parametersInSuccess;
                            break;
                        case 'complete':
                            $arrayCheck = $parametersInComplete;
                            break;
                        default:
                            break;
                    }
                    foreach ($arrayCheck as $parameter) {// check if parameters can be found in the corresponding ajax parameter
                        if (!preg_match('/\b'.$parameter.'\b/', $ajaxParamValue)) {
                            trigger_error('Parameter "'.$parameter.'" missing in "'.$ajaxParamName.'" of function '.$functionName, E_USER_ERROR);
                        }
                    }

                    if ($ajaxParamName == 'error' && strpos($ajaxParamValue, 'ajaxerror();') !== false) {
                        $mergeAjaxParams = true;
                        $ajaxParamValue = str_replace('ajaxerror();', 'if (isType(error,\'function\')) {error(jqXHR,textStatus,errorThrown);}', $ajaxParamValue);
                    }
                    if ($ajaxParamName == 'success' && strpos($ajaxParamValue, 'ajaxsuccess();') !== false) {
                        $mergeAjaxParams = true;
                        $ajaxParamValue = str_replace('ajaxsuccess();', 'if (isType(success,\'function\')) {success(data);}', $ajaxParamValue);
                    }
                    if ($ajaxParamName == 'complete' && strpos($ajaxParamValue, 'ajaxcomplete();') !== false) {
                        $mergeAjaxParams = true;
                        $ajaxParamValue = str_replace('ajaxcomplete();', 'if (isType(complete,\'function\')) {complete(jqXHR,textStatus);}', $ajaxParamValue);
                    }

                    // delete the 3 callback functions as they should be merged
                    if (strpos($ajaxParamValue, $ajaxParamName.'(') !== false) {
                        array_push($ajaxParamToBeDeleted, $this -> ajaxParamName.'.'.$ajaxParamName);
                    }
                    if ($mergeAjaxParams) {
                        $this -> outputFunctions.= "
            var ".$ajaxParamName." = ".$this -> ajaxParamName.".".$ajaxParamName.";";
                    }
                    $temp.= ((($ajaxParamName == 'type' || $ajaxParamName == 'method') && $ajaxParamValue == "'GET'") ? "" : ($ajaxParamName.": ".($ajaxParamName == 'data' ? "JSON.stringify(".$ajaxParamValue.")" : $ajaxParamValue).",
                "));
                }
            }
            if (sizeof($ajaxCheckKeys) > 0) {
                trigger_error('Ajax parameters "'.implode(", ",$ajaxCheckKeys).'" required in ajax object due to function parameter requirements (ajaxCheck activated) of function '.$functionName, E_USER_ERROR);
            }
        }

        // ajax parameters and store arguments
        $this -> outputFunctions.= "
            ".($storeArgumentsAs ? $this -> varPrivate.".".$storeArgumentsAs." = arguments[0];
            " : "")."var obj = {
                ".$temp;

        // ajax parameters end and function end
        $this -> outputFunctions.= "functionName: functionName
            };
            ";
        foreach ($ajaxParamToBeDeleted as $paramToBeDeleted) {
            $this -> outputFunctions.=  "delete ".$paramToBeDeleted.";
            ";
        }
        $this -> outputFunctions.= $this -> outputObj.".api(extend(obj,".$this -> ajaxParamName."));
        };
";
    }

    function addFunctionApplication($obj){
        //$this -> outputFunctions;
    }

    function printLibraryStart(){
        echo $this -> libraryStartString;
    }

    function printFunctions(){
        echo $this -> outputFunctions;
    }

    function printLibraryEnd(){
        echo $this -> libraryEndString;
    }
}

?>
