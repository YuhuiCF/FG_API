
const {log} = require('console');
const Promise = require('bluebird');

const fgApi = require('./fg-api-core');
const fgAuth = require('../auth/fg');
const R = require('ramda');

// const contextKey = 'BIhYGSk-DlrnijwhGHI-FwoS4etKfqi';

function getTranslations({handledContextKeys, LIMIT, params, targetContext}) {
  params.requestParams.type = 'WEBKIT_TEXT_USED';

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
  params.requestParams.type = 'WEBKIT_TEXT_USED';
  log(params);

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

        loggings.forEach((logging) => {
          if (typeof(logging.infos[0].contextKey) === 'undefined') {
            log(logging.infos[0]);
          }
        });
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

function listApiErrors({LIMIT, params}) {
  params.requestParams.type = 'ApiError';
  log(params);

  return fgApi
    .listLoggings(params)
    .then((loggings) => {
      if (loggings.length === LIMIT) {
        log('LIMIT reached');
      } else {
        R.forEach((logging) => {
          const data = logging.infos[0].restangularErrorResponse.data;
          if (data) {
            const errorObj = data[0];
            errorObj.logginId = logging.id;
            const finalErrorObj = extractError(errorObj);
            // if (finalErrorObj.lastErrorCode === 'EXCEPTION_VEHICLE_IDENTIFICATION_BY_VIN') {
              log(finalErrorObj);
            // }
          }
        }, loggings);
      }
      log(loggings.length);
    })
  ;
}

function listVinApiErrors({LIMIT, params}) {
  params.requestParams.type = 'ApiError';
  log(params);

  return fgApi
    .listLoggings(params)
    .then((loggings) => {
      const results = [];
      if (loggings.length === LIMIT) {
        log('LIMIT reached');
      } else {
        R.forEach((logging) => {
          const payload = logging.infos[0].restangularErrorResponse.config.data;
          const data = logging.infos[0].restangularErrorResponse.data;

          if (data) {
            const errorObj = data[0];
            errorObj.logginId = logging.id;
            const finalErrorObj = extractError(errorObj);
            if (
              finalErrorObj.lastErrorCode === 'EXCEPTION_VEHICLE_IDENTIFICATION_BY_VIN' &&
              finalErrorObj.errorMessage.indexOf('illegal length') < 0 &&
              finalErrorObj.errorMessage.indexOf('illegal chars') < 0
            ) {
              finalErrorObj.vin = payload.vin;
              const errorMessageLength = finalErrorObj.errorMessage.length;
              finalErrorObj.errorMessage = finalErrorObj.errorMessage.substring(0, 200) + (errorMessageLength >= 200 ? '...' : '');
              results.push(finalErrorObj);
            }
          }

        }, loggings);
      }
      const finalResults = R.uniqBy((item) => {
        return item.vin;
      }, R.map(({errorMessage, vin}) => {
        return {
          vin,
          errorMessage,
        };
      }, results));
      log(JSON.stringify(finalResults, null, 2));
      log(finalResults.length);
      log(loggings.length);
    })
  ;

}

function extractError(errorObj) {
  if (errorObj && errorObj.causedBy) {
    const {logginId} = errorObj;
    const lastErrorCode = errorObj.errorCode || errorObj.lastErrorCode;
    const lastErrorMessage = errorObj.errorMessage || errorObj.lastErrorMessage;
    const newErrorObj = R.merge(errorObj.causedBy, {
      lastErrorCode,
      lastErrorMessage,
      logginId,
    });

    return extractError(newErrorObj);
  } else {
    return errorObj;
  }
}

function listEquipmentsLength({LIMIT, params}) {
  params.requestParams.type = 'EquipmentsLength';

  return fgApi
    .listLoggings(params)
    .then((loggings) => {
      if (loggings.length === LIMIT) {
        log('LIMIT reached');
      } else {
        R.compose(
          R.forEach((loggingData) => {
            log(loggingData);
          }),
          R.sortBy(R.prop('equipmentsLength')),
          R.map((logging) => {
            return logging.infos[0];
          }
        ))(loggings);
      }
      log(loggings.length);
    })
  ;
}

function listWindowJSError({LIMIT, params}) {
  params.requestParams.type = 'WindowJSError';

  return fgApi
    .listLoggings(params)
    .then((loggings) => {
      if (loggings.length === LIMIT) {
        log('LIMIT reached');
      } else {
        R.forEach((logging) => {
          const info = logging.infos[0];
          log(info);
        }, loggings);
      }
      log(loggings.length);
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
        from: 1510128701088,// 1510303870457
        offset: 0,
        limit: LIMIT,
        // type: 'ApiError',// type: 'WindowJSError',// type: 'WEBKIT_TEXT_USED',
      }
    };

    const toBeHandledContextKeys = [

    ];
    const handledContextKeys = [
      'BgZJSnce05xJ', // https://www.bmw-service-hengge.de/reparaturkostenrechner
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
      'uKZByzfcTTFT', // https://www.fairgarage.de/webkit/testbetriebe/porsche/werkstatt.html
      'vJ5Re89Q0rz1', // http://www.langer.de/net/phpuli/fairgarageFiatneu.php
      'vPGlsmRQxwBt', // http://www.wigger-automobile.de/go.to/modix/now/werkstattportal.html
      'vtKbkTMHCcQt', // http://www.langer.de/net/phpuli/fairgarageAlleModelle.php
      'vtKKJUzJd89H', // http://www.langer.de/net/phpuli/fairgarageBMWneu.php
      'we7XhzWQGfwR', // http://autohaus-fritze.de/Unternehmen/Online-Werkstatt-Termin.html

      'MAZDA-10400', // http://autohaus-krzykowski.de/go.to/modix/now/fairgarage.html
      'MAZDA-10771', // http://regensburg1.auto-schindlbeck.de/go.to/modix/now/fairgarage.html?service=INNENRAUMFILTER
      'MAZDA-11195', // http://meklenborg-steglitz.de/go.to/modix/now/fairgarage.html?service=RADLAGER
      'MAZDA-11364', // http://mazda-autohaus-haeusler-muenchen.de/go.to/modix/now/fairgarage.html
      'MAZDA-14121', // http://gotha.ahbautomobile.de/go.to/modix/now/fairgarage.html?service=BREMSEN
      'MAZDA-15210', // http://auto-volz.de/go.to/modix/now/fairgarage.html?service=KLIMAANLAGENWARTUNG#/?FZA=62303&HST=19545&HT=20024&CT=20060
      'MAZDA-15253', // https://buelo.mazda-autohaus.de/go.to/modix/now/fairgarage.html?service=OELWANNENDICHTUNG
      'MAZDA-15403', // http://auto-fischer-karben.de/go.to/modix/now/fairgarage.html?service=INSPEKTION#/?FZA=62303&HST=19545&HT=72246&CT=201111
      'MAZDA-15627', // https://berlenbach.mazda-autohaus.de/go.to/modix/now/fairgarage.html?service=OELWANNENDICHTUNG#/?FZA=62303&HST=19545&HT=20160&CT=200304
      'MAZDA-15808', // http://mazda.autohaus-zurell.de/go.to/modix/now/fairgarage.html?service=ZUENDKERZEN

      'BIhYGSl-664728JSqwo-AixSV860itZ', // http://www.auto-zeilinger.de/index.php?id=11015
      'BIhYGSk-DlrnijwhGHI-FwoS4etKfqi', // API Tester default
    ];

    const targetContext = 'uKZByzfcTTFT';
    // return getTranslations({handledContextKeys, params, LIMIT, targetContext});

    // return listContextsWithTranslations({handledContextKeys, LIMIT, params, toBeHandledContextKeys});

    // return listLoggingTypes({LIMIT, params});
    // return listEquipmentsLength({LIMIT, params});
    // return listWindowJSError({LIMIT, params});
    return listApiErrors({LIMIT, params});
    // return listVinApiErrors({LIMIT, params});
  })
  .finally(() => {
    return fgApi.logout();
  })
;
