
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
    const LIMIT = 100000;
    const params = {
      requestParams: {
        // contextKey,
        component: 'FRONT-END',
        from: 1498687200000,// 1498428000000 // 1457823200000
        offset: 0,
        limit: LIMIT,
        // type: 'WindowJSError',// type: 'WEBKIT_TEXT_USED',
      }
    };

    const toBeHandledContextKeys = [
      'MAZDA-14121',
      'MAZDA-15253',
      'MAZDA-15210',
      'MAZDA-15403',
      'MAZDA-15627',
    ];
    const handledContextKeys = [
      'BTQtpg43uSvX', // BDK
      'CFdmvvQns7zD', // Acoat de-at https://www.fahrzeug-reparatur.com/de-at/rost-entfernen-auto.html
      'DAT_WEBKIT_001', // DAT
      'ET0QS4PuW2uC', // Acoat fr-ch https://www.fahrzeug-reparatur.com/fr-ch/renovation-voiture.html
      'FeQmx1xrAFWB', // Acoat de-ch https://www.fahrzeug-reparatur.com/de-ch/smart-repair-stossstange.html
      'FiOAZVk7A8lF', // Acoat de-de https://www.fahrzeug-reparatur.com/de-de/autotuer-lackieren-kosten.html
      'fymKXoR3Pomi', // Spiegel http://werkstattvergleich.spiegel.de/
      'irOsrrOQdInr', // http://www.autounfall.info/Unfallschaden.1189.0.html
      'qFeMPkaIAszI', // https://renner-parchim.de/werkstatt-termin/
      'UjfJ3Kk2lDH9', // http://www.langer.de/net/phpuli/fairgarageMINIneu.php
      'uKS1NOOap9Fy', // https://www.fairgarage.de/webkit/testbetriebe/porsche/inspektion.html
      'vJ5Re89Q0rz1', // http://www.langer.de/net/phpuli/fairgarageFiatneu.php
      'vPGlsmRQxwBt', // http://www.wigger-automobile.de/go.to/modix/now/werkstattportal.html
      'vtKbkTMHCcQt', // http://www.langer.de/net/phpuli/fairgarageAlleModelle.php
      'vtKKJUzJd89H', // http://www.langer.de/net/phpuli/fairgarageBMWneu.php
      'we7XhzWQGfwR', // http://autohaus-fritze.de/Unternehmen/Online-Werkstatt-Termin.html

      'MAZDA-10400', // http://autohaus-krzykowski.de/go.to/modix/now/fairgarage.html
      'MAZDA-10771', // http://regensburg1.auto-schindlbeck.de/go.to/modix/now/fairgarage.html?service=INNENRAUMFILTER
      'MAZDA-11195', // http://meklenborg-steglitz.de/go.to/modix/now/fairgarage.html?service=RADLAGER
      'MAZDA-11364', // http://mazda-autohaus-haeusler-muenchen.de/go.to/modix/now/fairgarage.html
      'MAZDA-15808', // http://mazda.autohaus-zurell.de/go.to/modix/now/fairgarage.html?service=ZUENDKERZEN

      'BIhYGSl-664728JSqwo-AixSV860itZ', // http://www.auto-zeilinger.de/index.php?id=11015
      'BIhYGSk-DlrnijwhGHI-FwoS4etKfqi', // API Tester default
    ];

    const targetContext = 'MAZDA-11364';
    // return getTranslations({handledContextKeys, params, LIMIT, targetContext});

    return listContextsWithTranslations({handledContextKeys, LIMIT, params, toBeHandledContextKeys});

    // return listLoggingTypes({LIMIT, params});
  })
  .finally(() => {
    return fgApi.logout();
  })
;
