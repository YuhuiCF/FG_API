
var env = env || null;

checkEnvironment();

function checkEnvironment(){
	var urlEnv = window.location.hostname.split('.')[0];
	/*
	if (env != urlEnv) {
		window.location.hostname = window.location.hostname.replace(urlEnv,env);
	}
	*/
	env = urlEnv
}
