
const {log} = require('console');
const Promise = require('bluebird');

const fgApi = require('./fg-api-core');
const fgAuth = require('../auth/fg');
const R = require('ramda');

// const contextKey = 'BIhYGSk-DlrnijwhGHI-FwoS4etKfqi';

function getTranslations({handledContextKeys, LIMIT, params, targetContext}) {
  // set translations
  return fgApi
    .listLoggings(params)
    .then((loggings) => {
      log(loggings.length);
      if (loggings.length === LIMIT) {
        log('LIMIT reached');
      } else {

        let found = false;

        loggings.forEach((logging) => {
          if (!found && handledContextKeys.indexOf(targetContext) === -1 && logging.infos[0].contextKey === targetContext) {
            found = true;
            log(logging.infos[0]);
          }
        });
      }
    })
  ;
}

function listContextsWithTranslations({handledContextKeys, LIMIT, params, toBeHandledContextKeys}) {
  return fgApi
    .listLoggings(params)
    .then((loggings) => {
      log(loggings.length);
      if (loggings.length === LIMIT) {
        log('LIMIT reached');
      } else {
        const output = R.uniq(
          R.map((logging) => {
            return logging.infos[0].contextKey;
          })(loggings)
        );

        log(R.without(toBeHandledContextKeys, R.without(handledContextKeys, output)));
      }
    })
  ;
}

function listLoggingTypes({LIMIT, params}) {
  return fgApi
    .listLoggings(params)
    .then((loggings) => {
      log(loggings.length);
      if (loggings.length === LIMIT) {
        log('LIMIT reached');
      } else {
        const output = R.uniq(
          R.map((logging) => {
            return logging.type;
          })(loggings)
        );

        log(output);
      }
    })
  ;
}

// [ 'WEBKIT_TEXT_USED', 'ApiError' ]
fgApi.configure(fgAuth.host);

fgApi
  .login({
    requestBody: {
      username: fgAuth.username,
      password: fgAuth.password
    }
  })
  .then(() => {
    const LIMIT = 10000;
    const params = {
      requestParams: {
        // contextKey,
        component: 'FRONT-END',
        from: 1497823200000,
        offset: 0,
        limit: LIMIT,
        type: 'WEBKIT_TEXT_USED',
      }
    };

    const toBeHandledContextKeys = [
      'MAZDA-10771',
      'MAZDA-15808',
      'MAZDA-14121',
      'MAZDA-15253',
      'MAZDA-15210',
      'MAZDA-15403',
      'MAZDA-15627',
      'MAZDA-10400',
      'MAZDA-11364',
      'MAZDA-11195',
      'BIhYGSl-664728JSqwo-AixSV860itZ',
      'vPGlsmRQxwBt', // http://www.wigger-automobile.de/go.to/modix/now/werkstattportal.html
    ];
    const handledContextKeys = [
      'BTQtpg43uSvX', // BDK
      'CFdmvvQns7zD',
      'DAT_WEBKIT_001', // DAT
      'ET0QS4PuW2uC',
      'FeQmx1xrAFWB',
      'FiOAZVk7A8lF',
      'fymKXoR3Pomi',
      'irOsrrOQdInr',
      'qFeMPkaIAszI',
      'UjfJ3Kk2lDH9', // http://www.langer.de/net/phpuli/fairgarageMINIneu.php
      'uKS1NOOap9Fy', // https://www.fairgarage.de/webkit/testbetriebe/porsche/inspektion.html
      'vJ5Re89Q0rz1',
      'vtKbkTMHCcQt',
      'vtKKJUzJd89H',
      'we7XhzWQGfwR', // http://autohaus-fritze.de/Unternehmen/Online-Werkstatt-Termin.html

      'BIhYGSk-DlrnijwhGHI-FwoS4etKfqi',
    ];

    const targetContext = 'vPGlsmRQxwBt';
    return getTranslations({handledContextKeys, params, LIMIT, targetContext});

    // return listContextsWithTranslations({handledContextKeys, LIMIT, params, toBeHandledContextKeys});

    // return listLoggingTypes({LIMIT, params});
  })
  .finally(() => {
    return fgApi.logout();
  })
;
