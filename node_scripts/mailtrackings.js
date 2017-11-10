
const fgApi = require('./fg-api-core');
const fgAuth = require('../auth/fg');
const R = require('ramda');


fgApi.configure(fgAuth.host);

fgApi
  .login({
    requestBody: {
      username: fgAuth.username,
      password: fgAuth.password
    }
  })
  .then(() => {
    const params = {
      requestParams: {
        status: 'FAILED',
        offset: 0,
        limit: 200,
      }
    };
    return fgApi.listMailTrackings(params);
  })
  .then((mailTrackings) => {
    const output = R.uniq(
      R.map((mailTracking) => {
        return mailTracking.mailName;
      })(mailTrackings)
    );
    console.log(output);
  })
  .finally(() => {
    return fgApi.logout();
  })
;
