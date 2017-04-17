
const fgApi = require('./fg-api-core');
const fgAuth = require('../auth/fg');
const newBids = require('./bids');
const Promise = require('bluebird');


let contextKeys = [
  {contextKey: 'CFdmvvQns7zD', locale: 'de-at'},
  {contextKey: 'FeQmx1xrAFWB', locale: 'de-ch'},
  {contextKey: 'FiOAZVk7A8lF', locale: 'de-de'},
  {contextKey: 'ET0QS4PuW2uC', locale: 'fr-ch'},
];

fgApi.configure(fgAuth.host);

fgApi
  .login({
    requestBody: {
      username: fgAuth.username,
      password: fgAuth.password
    }
  })
  .then(() => {
    let promises = [];
    let output = {};
    let outputSimple = {};

    contextKeys.forEach((config) => {
      let contextKey = config.contextKey;
      let locale = config.locale;
      let params = {
        requestParams: {ctxKey: contextKey, offset: 0, limit: 1}
      };
      promises.push(
        fgApi.listBookedOffers(params).then((bookedOffers) => {
          if (bookedOffers && bookedOffers.length) {
            output[contextKey + '.' + locale] = bookedOffers[0];
            outputSimple[contextKey + '.' + locale] = bookedOffers[0].key;
          }
        }, (err) => {
          console.log(err);
        })
      );
    });

    return Promise.all(promises).finally(() => {
      console.log('=============== BOOKED OFFERS START ===============');
      console.log(output);
      console.log(outputSimple);
      console.log('=============== BOOKED OFFERS END ===============');
    });
  })
  .then(() => {
    let promises = [];
    let output = {};
    let outputSimple = {};
    let offersOutput = {};
    let offersOutputSimple = {};

    contextKeys.forEach((config) => {
      let contextKey = config.contextKey;
      let locale = config.locale;
      let params = {
        requestParams: {ctxKey: contextKey, offset: 0, limit: 5}
      };
      promises.push(
        fgApi.listOfferSearches(params).then((offerSearches) => {
          if (offerSearches && offerSearches.length) {
            output[contextKey + '.' + locale] = offerSearches;
            outputSimple[contextKey + '.' + locale] = offerSearches.map((offerSearch) => {
              return offerSearch.id;
            });

            let listOffersParams = {
              requestParams: {searchKey: offerSearches[0].id}
            };
            return fgApi.listOffers(listOffersParams).then((offers) => {
              if (offers && offers.length) {
                offersOutput[contextKey + '.' + locale] = offers;
                offersOutputSimple[contextKey + '.' + locale] = offers.map((offerSearch) => {
                  return offerSearch.id;
                });
              } else {
                console.log('offers');
                console.log(offers);
              }
            }, (err) => {
              console.log(err);
            });
          } else {
            console.log('offerSearches');
            console.log(offerSearches);
          }
        }, (err) => {
          console.log(err);
        })
      );
    });

    return Promise.all(promises).then(() => {
      console.log('=============== OFFER SEARCHES START ===============');
      console.log(output);
      console.log(outputSimple);
      console.log('=============== OFFER SEARCHES END ===============');
      console.log('=============== OFFERS START ===============');
      console.log(offersOutput);
      console.log(offersOutputSimple);
      console.log('=============== OFFERS END ===============');
    });
  })
  .finally(() => {
    return fgApi.logout();
  })
;
