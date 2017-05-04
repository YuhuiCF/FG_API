
var FG1;
var loginRequired = false;
var tests = [];
var testsIndex = 0;
var buttonsCounter = 0;

function getEnvironment(){
    var hostEnv = window.location.hostname.split('.')[0];
    if (hostEnv.indexOf('dev') >= 0) {
        hostEnv = 'api-dev';
    } else if (hostEnv.indexOf('qa') >= 0) {
        hostEnv = 'api-qa';
    } else {
        hostEnv = 'api';
    }
    return getUrlParam('env') || hostEnv;
}

function matchEnvironment(environment){
    // TODO
}

function write(data){
	if (typeof data == 'string' || typeof data == 'number' || Object.prototype.toString.call(data) == '[object Array]') {
        //if (typeof data == 'string' && data.indexOf('TOCHECK') === 0) {
        if (typeof data == 'string' && data.indexOf(data.match(/(\w)+/g)[0].toUpperCase()) === 0 && data.indexOf('FG') !== 0) {
            data = '<br/>' + data;
        }
        appendP(data);
		console.log(data);
	}
	else if (typeof data == 'object') {
		appendPre(data);
		console.dir(data);
	}
}

function writeError(message){
    appendP('&nbsp;&nbsp;&nbsp;&nbsp;ERROR: ' + message);
    console.error(message);
    alert('ERROR found');
}

function appendP(data){// not object
	$('body').append('<p>' + data + '</p>');
}

function appendPre(data){// object
    $('body').append('<pre><br/>' + JSON.stringify(data,null,4) + '<br/></pre>');
}

function appendButton(obj){// object
    var action = obj.action;
    var text = obj.text || action;
    var id = 'button' + (buttonsCounter++).toString();
	$('body').append('<button id="' + id + '" onclick="javascript:' + action + ';">' + text + '</button><br/>');
    $('#' + id).focus();
}

function getParamVal(name,string){
    var result = [];
    var search = string;
    //var search = window.location.search.substring(1);
    var searchParameters = search.split('&');
    for (var i = 0; i < searchParameters.length; i++ ){
        var parameter = searchParameters[i].split('=');
        if (parameter[0] === name && $.inArray(parameter[1], result) === -1) {
            if (typeof parameter[1] === 'undefined'){
                parameter[1]=true;
            }
            if (parameter[1] === 'true'){
                parameter[1] = true;
            }
            if (parameter[1] === 'false'){
                parameter[1] = false;
            }
            result.push(parameter[1]);
        }
    }
    return result;
}

function getUrlParam(name){
    var value = getParamVal(name, window.location.search.substring(1));

    if (value.length > 1) {
        return value;
    } else if (value.length === 1) {
        return value[0];
    } else {
        return false;
    }
}

function testNext(obj){
	var limit = tests.length;
    var thisIndex = testsIndex;
	if (testsIndex >= limit) {
        console.log('Test function groups completed');
		return;
	}
    console.log('Test function group ' + (thisIndex+1).toString() + '/' + limit.toString());
	return tests[testsIndex++](obj);
}

function login(pobj){
    var obj = pobj || {};
    var psw = obj.psw;
    var usn = obj.usn;
    var env = obj.env || getEnvironment();
    FG1.setProperties({env:env});
    if (psw && usn) {
        FG1.adminUserLogin({
            loginData: {
                locationId: 1,
                username: usn,
                password: psw
            },
            newAgreements: function(data){
                write('FG1 login newAgreements()');
                write('This message should not be shown');
            },
            ajax: {
                complete: function(jqXHR,textStatus){
                    write('FG1 login complete()');

                    testNext();
                }
            }
        });
    } else {
        write('FG1 login with neither psw nor usn');

        testNext();
    }
}

(function(){
    if (getUrlParam('contextKey')) {
        contextKey = getUrlParam('contextKey');
    } else if ((getEnvironment().match(/master/) && getEnvironment().match(/master/).length > 0) || (getEnvironment().match(/dev/) && getEnvironment().match(/dev/).length > 0)) {// master environment and dev environment
        contextKey = 'BIhYGSk-DlrnijwhGHI-FwoS4etKfqi';
    } else {
        contextKey = 'AAAT9x0T52EpJXNGT502';
    }

    var urlContextKey = getUrlParam('contextKey');
    if (urlContextKey.length > 0) {
        contextKey = urlContextKey;
    }
    window.FG1 = new fg({
            contextKey: contextKey,
            env: getEnvironment(),
            ssl: window.location.protocol.replace(':','')
        });
})();

tests.push(function(){
    if (loginRequired) {
        FG1.checkLoginStatus({
            ajax: {
                success: function(data){
                    write('FG1 checkLoginStatus success()');
                    if (data.id !== 1) {
                        write('login({env:"env",usn:"usn",psw:"psw"}). login() with parameter {env:env,usn:usn,psw:psw}. Current FG library environment: ' + FG1.properties.env);
                    } else {
                        testNext();
                    }
                },
                error: function(){
                    write('FG1 checkLoginStatus error()');
                }
            }
        });
    } else {
        write('loginRequired not required');
        testNext();
    }
});
