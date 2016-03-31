<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        .clearfix:before,
        .clearfix:after{
            content:" ";clear:both;display:table;
        }
        .functions{margin-left:20px;}
        .hide{display:none;}
    </style>
</head>
<body>

<h1>Build FG API Library</h1>

<div>
    <h2>Select Library type</h2>
    <select class="type">
        <option value="1">Full version</option>
        <option value="0">None</option>
        <option value="Portal">Portal</option>
        <option value="offerValidation">Offer validation</option>
        <option value="offerComparison">Offer comparison</option>
        <option>Customized</option>
    </select>
</div>

<div>
    <h2>Select Functions</h2>

    <?php
        $fileQuery = 'fairgarage.functions.';
        $files = scandir(getcwd());
        $remainingFiles = $files;
        //$includeFiles = array();
        foreach ($files as $fileName) {
            if (substr($fileName, 0, strlen($fileQuery)) === $fileQuery) {// correct file name type
                $category = substr($fileName, strlen($fileQuery), -4);
                if (!strpos($category, '.')) {// is a function category
                    echo '
    <div class="category">
        ';
                    echo '<input type="checkbox" id="'.$category.'"><label for="'.$category.'">'.$category.'</label>
        ';
                    unset($remainingFiles[array_search($fileName, $remainingFiles)]);
                    $newFileQuery = $fileQuery.$category.'.';
                    echo '<div class="functions">';
                    foreach ($remainingFiles as $subFileName) {
                        if (substr($subFileName, 0, strlen($newFileQuery)) === $newFileQuery) {// correct file name type
                            $functionName = substr($subFileName, strlen($newFileQuery), -4);
                            if ($functionName) {
                                echo '
            <input type="checkbox" id="'.$functionName.'"><label for="'.$functionName.'">'.$functionName.'</label><img class="hide" src="../_img/spinner_small.gif"><br/>';
                                unset($remainingFiles[array_search($subFileName, $remainingFiles)]);
                            }
                        }
                    }

                    echo '
        </div>
    </div>';
                }
            } else {
                unset($remainingFiles[array_search($fileName, $remainingFiles)]);
            }
        }
    ?>

    <br/>
    <div class="checkRPWrapper">
        <div class="processingHint"></div>
        <button class="checkRP">Check Request Parameter Names</button>
    </div>
    <br/>
    <div>
        <button class="submitBuild">Submit</button>
    </div>
</div>

<script src="../_js/jquery.min.js"></script>
<script>
    var includeFunctions = [];
    var excludeFunctions = [];
    var initAction = 'fairgarage.build.php';
    var includeAction = '';
    var excludeAction = '';

    $(document).on('change','.type',function(){
        switch (this.options[this.selectedIndex].value) {
            case '0':
                $('.category input').prop('checked',false).trigger('change');
                break;
            case '1':
                $('.category input').prop('checked',true).trigger('change');
                break;
            case 'Portal':
                $('.category input').prop('checked',false).trigger('change');
                var functions = ['findAgreement','checkSession','checkLoginStatus','logout','webUserLogin','isWebUserRegistered','requestResetPassword','resetPassword','setPassword','createBooking','createWebUserBookingHistory','createBookingVoting','getWebUserBooking','getBookingVoting','getWebUserBookingVersion','getWebUserBookingHistories','webUserCanelBooking','getStaticContents','getAllFluidTypes','findLocation','getLocation','getLocationRatings','isLocationBookableOnline','getOfferForwardURL','getGuildmembership','getOffer','getOfferList','getOfferListFilters','getOfferTimeSlot','createOfferSearch','getOfferSearch','findRegion','getRegionBySignature','getRegionOfUser','findServiceByCatalog','findService','getAllInspectionServicePositions','getServiceById','track','registerUser','updateUser','createUserSearch','getUserSearch','findVehicleByCatalog','getVehicleCategory','getVehicleByVIN','findVehicleByExternalId','getVehicleByVehicleTypeId','findEquipmentsForVehicleAndService'];
                $.each(functions,function(i,id){
                    $('#' + id).prop('checked',true).trigger('change');
                    $('#_' + id).prop('checked',true).trigger('change');
                });
                break;
            case 'offerValidation':
                $('.category input').prop('checked',false).trigger('change');
                var functions = ['getBookingVersion','getLocation','getOffer','getOfferList','createOfferSearch','getOfferSearch','getServiceById','track','createUserSearch','getUserSearch'];
                $.each(functions,function(i,id){
                    $('#' + id).prop('checked',true).trigger('change');
                    $('#_' + id).prop('checked',true).trigger('change');
                });
                break;
            case 'offerComparison':
                $('.category input').prop('checked',false).trigger('change');
                var functions = ['getOffer','getOfferList','createOfferSearch','createUserSearch','findService','getServiceById','findVehicleByCatalog','getRegionBySignature'];
                $.each(functions,function(i,id){
                    $('#' + id).prop('checked',true).trigger('change');
                    $('#_' + id).prop('checked',true).trigger('change');
                });
                break;
            default:
                break;
        }
    });

    $(document).on('change','.category > input',function(){
        var inputs = $(this).closest('.category').find('.functions input');
        if (this.checked) {
            inputs.prop('checked',true).trigger('change');
        } else {
            inputs.prop('checked',false).trigger('change');
        }
    });

    $(document).on('change','.functions input',function(){
        var itemIndex = $.inArray(this.id,includeFunctions);
        //var itemIndexExclude = $.inArray(this.id,excludeFunctions);
        if (this.checked) {
            var functions = $(this).closest('.category').find('.functions');
            if (itemIndex < 0) {
                includeFunctions.push(this.id);
            }
            /*
            if (itemIndexExclude >= 0) {
                excludeFunctions.splice(itemIndexExclude,1);
            }
            */
            if (functions.find('input').length == functions.find('input:checked').length) {
                $(this).closest('.category').find('> input').prop('checked',true);
            }
        } else {
            $(this).closest('.category').find('> input').prop('checked',false);
            if (itemIndex >= 0) {
                includeFunctions.splice(itemIndex,1);
            }
            /*
            if (itemIndexExclude < 0) {
                excludeFunctions.push(this.id);
            }
            */
        }

        if (includeFunctions.length > 0) {
            includeAction = initAction + '?include&'+includeFunctions.join('&');
        } else {
            includeAction = initAction;
        }
        /*
        if (excludeFunctions.length > 0) {
            excludeAction = initAction + '?exclude&'+excludeFunctions.join('&');
        } else {
            excludeAction = initAction;
        }
        */
    });

    var outputs = [];
    var APIcount;
    $(document).on('click','.checkRP',function(){
        outputs = [];
        $('.checkRPWrapper p,.checkRPWrapper pre').hide();
        checkPathDataCounts = 0;
        var names = [];
        $('.functions input:checked').each(function(){
            names.push($(this).closest('.category').find('> input').attr('id') + '.' + this.id);
            outputs.push({});
        });
        APIcount = names.length;

        $.each(names,function(i){
            var name = this.toString();
            getJSfunction({
                name: name,
                success: function(data){
                    var basePathMatches = data.match(/base path:[^,|\n]*/g);
                    var fullPathMatches = data.match(/full path:[^,|\n]*/g);
                    var basePath = (basePathMatches ? basePathMatches[0].replace('base path: ','') : null);
                    var fullPath = (fullPathMatches ? fullPathMatches[0].replace('full path: ','') : null);
                    var dataKeyMatches = data.match(/                  \* \@key[^\n]*/g);
                    var dataMatches = data.match(/data:.*,\n/);
                    var urlParamMatches = data.match(/urlParam:.*,\n/);
                    var method = data.match(/type:.*,/) || ['type: "GET"'];
                    method = method[0].replace('type','').replace(/\W/g,'');
                    if (dataKeyMatches || dataMatches || urlParamMatches) {
                        if (dataKeyMatches) {
                            outputs[i].urlKeys = [];
                            outputs[i].payloadKeys = [];
                            $.each(dataKeyMatches, function(){
                                var matchedString = this.toString().replace('                  \* \@key','');
                                var isUrlParameter = matchedString.match(/\(API url parameter\)/);
                                isUrlParameter = isUrlParameter ? true : false;
                                //console.log(isUrlParameter);
                                matchedString = matchedString.replace(/\{.*\}/g,'');
                                matchedString = matchedString.replace(/\(.*\)/g,'');
                                //console.log(matchedString);
                                matchedString = matchedString.match(/(\w)+/g)[0];
                                //console.log(matchedString);
                                if (isUrlParameter) {
                                    outputs[i].urlKeys.push(matchedString);
                                } else {
                                    outputs[i].payloadKeys.push(matchedString);
                                }
                            });
                        }
                        if (dataMatches) {// default keys in ajax.data
                            dataMatches = dataMatches[0].replace('data:','');
                            dataKeyMatches = dataMatches.match(/(\w)*:/g);
                            if (dataKeyMatches) {
                                $.each(dataKeyMatches,function(i){
                                    dataKeyMatches[i] = dataKeyMatches[i].replace(/:/g,'');
                                });
                                outputs[i].defaultKeys = dataKeyMatches;
                            }
                        }
                        if (urlParamMatches) {// default keys in ajax.urlParam
                            urlParamMatches = urlParamMatches[0].replace('urlParam:','');
                            dataKeyMatches = urlParamMatches.match(/(\w)*:/g);
                            outputs[i].defaultKeys = outputs[i].defaultKeys || [];
                            if (dataKeyMatches) {
                                $.each(dataKeyMatches,function(i){
                                    dataKeyMatches[i] = dataKeyMatches[i].replace(/:/g,'');
                                });
                                outputs[i].defaultKeys = arrayUnique(outputs[i].defaultKeys.concat(dataKeyMatches));
                            }
                            if (outputs[i].defaultKeys.length == 0) {
                                delete outputs[i].defaultKeys;
                            }
                        }
                    }
                    outputs[i].name = name;
                    outputs[i].method = method;
                    /*
                    if (name.indexOf('login') > 0) {
                        var basePath = '/smp/api/authentication/login';
                        var fullPath = '/smp/api/authentication/login';
                    } else {
                        var basePath = data.match(/\n.*\/apitester.*\n/)[0];
                        basePath = basePath.match(/ -> [\S]*//*)[0];
                        basePath = basePath.replace(' -> ','');
                        var fullPath = data.match(/\n.*\/apitester.*\n/)[0];
                        fullPath = fullPath.match(/ --> [\S]*//*)[0];
                        fullPath = fullPath.replace(' --> ','');
                    }
                    */
                    outputs[i].basePath = basePath;
                    outputs[i].fullPath = fullPath;

                    // basePath && fullPath
                    if (basePath && fullPath) {//do only if base path and full path are given
                        var thisImg = $('label[for="'+outputs[i].name.split('.')[1]+'"]').next();
                        thisImg.show();
                        testAPIPath({
                            basePath: basePath,
                            success: function(data){
                                thisImg.hide();
                                if (data.length == 0) {
                                    writeError('nothing found for API base path ' + basePath + ' for outputs[' + i.toString() + ']');
                                } else {
                                    //if (method.toUpperCase() == 'GET') {// test parameters only for GET, currently}
                                        var APIFound = false;
                                        $.each(data,function(){
                                            if (outputs[i].fullPath == this.fullPath && this.method && this.method.toUpperCase() == method.toUpperCase()) {
                                                APIFound = true;
                                                if (this.requestParameters.length == 0 && this.requestBodyParameters.length == 0) {
                                                    if ((outputs[i].urlKeys && outputs[i].urlKeys.length > 0) || (outputs[i].defaultKeys && outputs[i].defaultKeys.length > 0)) {
                                                        console.dir(this);
                                                        writeError('no request parameters for API path ' + basePath + ' is required in function ' + outputs[i].name + '() in outputs[' + i.toString() + ']');
                                                    }
                                                    incrementPathDataCounts();
                                                } else {
                                                    outputs[i].requestParameters = [];
                                                    outputs[i].mandatoryRequestParameters = [];
                                                    outputs[i].requestBodyParameters = [];
                                                    $.each(this.requestBodyParameters,function(){
                                                        outputs[i].requestBodyParameters.push({
                                                            className: this.parameterType.className
                                                        });
                                                    });
                                                    var pathData = this;
                                                    if (outputs[i].requestBodyParameters.length > 0) {
                                                        $.each(outputs[i].requestBodyParameters,function(j){// requestBodyParameters
                                                            var thisBody = this;
                                                            var className = thisBody.className;
                                                            getClassDetails({
                                                                className: className,
                                                                success: function(data){
                                                                    var dataString = JSON.stringify(data);
                                                                    thisBody.body = data;
                                                                    thisBody.keys = [];
                                                                    for (var key in data){
                                                                        thisBody.keys.push(key.toString());
                                                                    }
                                                                    outputs[i].requestBodyParameters[j] = thisBody;

                                                                    checkPathData({
                                                                        pathData: pathData,
                                                                        i: i
                                                                    });
                                                                }
                                                            });
                                                        });
                                                    } else {
                                                        checkPathData({
                                                            pathData: pathData,
                                                            i: i
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                        if (!APIFound) {
                                            writeError('API with full path ' + fullPath + ' and method ' + method + ' for function ' + name + ' in outputs[' + i.toString() + '] not found');
                                        }
                                    //}
                                }// basePath found
                            }// testAPIPath success end
                        });
                    }
                }// getJSfunction success end
            });
        });
    });

    $(document).on('click','.submitBuild',function(){
        //window.location.href = (includeAction.length > excludeAction.length ? excludeAction : includeAction);
        window.location.href = includeAction;
    });

    function getJSfunction(obj){
        var name = obj.name || '';
        var success = obj.success;
        $.ajax({
            url: 'fairgarage.test.functions.php?' + name,
            success: function(data){
                if (data.indexOf('FgApiLibrary.php') > 0) {
                    alert('function ' + name + ' not added correctly, please check console, or fairgarage.test.functions.php?' + name);
                    return;
                }
                if (typeof success == 'function') {
                    success(data);
                }
            },
            error: function(){
                alert('error in getJSfunction');
            }
        });
    }

    function testAPIPath(obj){
        var basePath = obj.basePath;
        var success = obj.success;
        $.ajax({
            cache: true,
            url: '/smp/apitester/api/calls?basePath=' + basePath,
            success: function(data){
                if (typeof success == 'function') {
                    success(data);
                }
            },
            error: function(){
                alert('error in testAPIPath');
            }
        });
    }

    function getClassDetails(obj){
        var className = obj.className;
        var success = obj.success;
        $.ajax({
            cache: true,
            url: '/smp/apitester/api/objects/' + className + '/details',
            success: function(data){
                if (typeof success == 'function') {
                    success(data);
                }
            },
            error: function(){
                alert('error in getClassDetails');
            }
        });
    }

    var checkPathDataCounts = 0;
    function incrementPathDataCounts(){
        $('.checkRPWrapper .processingHint').text('Checking ' + (++checkPathDataCounts).toString() + '/' + APIcount.toString());
        if (checkPathDataCounts == APIcount) {
            $('.checkRPWrapper .processingHint').text('Done for ' + APIcount + ' APIs, more details could be found in console.dir(outputs).');
        }
    }

    function checkPathData(obj){
        var pathData = obj.pathData;
        var i = obj.i;
        $.each(pathData.requestParameters,function(){// requestParameters
            outputs[i].requestParameters.push({
                parameterName: this.parameterName,
                className: this.parameterType.className,
                mandatory: this.mandatory
            });
            if (this.mandatory) {
                outputs[i].mandatoryRequestParameters.push(this.parameterName);
            }
        });
        var hasRequestBody = ['PUT','POST'].indexOf(outputs[i].method.toUpperCase()) >= 0;
        var atLeastOneNotFound = false;
        var atLeastOnePayloadKeyNotFound = false;
        //if (!hasRequestBody) {
            var mandatoryRequestParameters = outputs[i].mandatoryRequestParameters;
        //}
        if (outputs[i].defaultKeys && outputs[i].defaultKeys.length > 0) {// defaultKeys is present
            $.each(outputs[i].defaultKeys,function(){
                var thisKey = this.toString();
                var found = false;
                if (hasRequestBody) {
                    $.each(outputs[i].requestBodyParameters,function(){
                        $.each(this.keys,function(){
                            if (this.toString() == thisKey) {
                                found = true;
                                return;
                            }
                        })
                    });
                } else {
                    var thisKeyIndex = mandatoryRequestParameters.indexOf(thisKey);
                    if (thisKeyIndex >= 0) {
                        mandatoryRequestParameters.splice(thisKeyIndex,1);
                    }
                    $.each(outputs[i].requestParameters,function(){
                        if (this.parameterName == thisKey) {
                            found = true;
                            return;
                        }
                    });
                }
                if (!found) {
                    atLeastOneNotFound = true;
                    writeError('data key ' + thisKey + ' in ajax.data or ajax.urlParam in of function ' + outputs[i].name + ' in outputs[' + i.toString() + '] with full path ' + outputs[i].fullPath + ' and method ' + outputs[i].method + ' not found');
                }
            });
        }
        if (outputs[i].urlKeys && outputs[i].urlKeys.length > 0) {// keys is present
            $.each(outputs[i].urlKeys,function(){
                var thisKey = this.toString();
                var found = false;
                var thisKeyIndex = mandatoryRequestParameters.indexOf(thisKey);
                if (thisKeyIndex > -1) {
                    mandatoryRequestParameters.splice(thisKeyIndex,1);
                }
                $.each(outputs[i].requestParameters,function(){
                    if (this.parameterName == thisKey) {
                        found = true;
                        return;
                    }
                });
                $.each(outputs[i].requestBodyParameters,function(){
                    if (typeof this.body[thisKey] != 'undefined') {
                        found = true;
                        return;
                    }
                });
                if (!found) {
                    atLeastOneNotFound = true;
                    writeError('API url parameter ' + thisKey + ' in the description of function ' + outputs[i].name + ' in outputs[' + i.toString() + '] with full path ' + outputs[i].fullPath + ' and method ' + outputs[i].method + ' not found');
                }
            });
        }
        if (outputs[i].payloadKeys && outputs[i].payloadKeys.length > 0) {// keys is present
            $.each(outputs[i].payloadKeys,function(){
                var thisKey = this.toString();
                var found = false;
                $.each(outputs[i].requestBodyParameters,function(){
                    $.each(this.keys,function(){
                        if (this.toString() == thisKey) {
                            found = true;
                            return;
                        }
                    })
                });
                if (!found) {
                    atLeastOneNotFound = true;
                    atLeastOnePayloadKeyNotFound = true;
                    writeError('API url parameter ' + thisKey + ' in the description of function ' + outputs[i].name + ' in outputs[' + i.toString() + '] with full path ' + outputs[i].fullPath + ' and method ' + outputs[i].method + ' not found');
                }
            });
        }
        if (atLeastOneNotFound) {
            var temp = '\n\t';
            if (atLeastOnePayloadKeyNotFound) {//TODO change condition
                temp = '';
                $.each(outputs[i].requestBodyParameters,function(){
                    temp += '<pre>' + JSON.stringify(this.body,null,4) + '</pre>';
                    temp = 'accepted request body of class ' + this.className + ':<br/>' + temp + '\n';
                });
            } else {
                $.each(outputs[i].requestParameters,function(){
                    if (temp.length > 4) {
                        temp += ',\n\t';
                    }
                    temp += this.parameterName +' of class ' + this.className;
                });
                temp = 'accepted request parameter names are: ' + temp;
            }
            write(temp);
        }
        if (!hasRequestBody && mandatoryRequestParameters.length > 0) {// some mandatory request parameters are missing
            writeError('mandatory data key(s) ["' + mandatoryRequestParameters.join('","') + '"] not found in function ' + outputs[i].name + ' in outputs[' + i.toString() + '] with full path ' + outputs[i].fullPath + ' and method ' + outputs[i].method);
        }
        incrementPathDataCounts();
    }

    function arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j]) {a.splice(j--, 1);}
            }
        }
        return a;
    };

    function writeError(str){
        $('.checkRPWrapper').append('<p>' + str + '</p>');
        console.error(str);
    }

    function write(str){
        $('.checkRPWrapper').append('<p>' + str + '</p>');
        console.log(str);
    }
</script>
<script>
    var search = window.location.search;
    search = search.replace('?','');
    var searches = search.split('&');

    var checkboxes = document.getElementsByTagName('input');

    if (search.length > 0) {
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
        for (var i = 0; i < searches.length; i++) {
            var input = document.getElementById(searches[i]);
            if (input !== null) {
                input.checked = true;
                $(input).trigger('change');
            }
        }
    } else {
        $('.type').trigger('change');
    }

</script>

</body>
</html>