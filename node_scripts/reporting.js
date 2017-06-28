
const fgApi = require('./fg-api-core');
const fgAuth = require('../auth/fg');
const newBids = require('./bids');
const Promise = require('bluebird');
const R = require('ramda');

const fs = require('fs');
const logger = fs.createWriteStream('./searches-suppl.csv', {
  flags: 'a' // 'a' means appending (old data will be preserved)
});

// 1485903600000
function listOfferSearches(fromDate = 1493123948460) {
  console.log(`fromDate: ${fromDate}`);

  const LIMIT = 100;

  let params = {
    requestParams: {
      ascending: true,
      fromDate: fromDate,
      limit: LIMIT,
      offset: 0,
      orderBy: 'date',
    }
  };

  return fgApi.listOfferSearches(params).then((offerSearches) => {
    const offerSearchesLength = offerSearches.length;
    console.log(`found ${offerSearchesLength} offerSearches`);

    let promises = [];

    let searchDate;
    let searchKey;

    R.forEach((offerSearch) => {
      const {regionSignature} = offerSearch;
      const {mileage} = offerSearch.vehicleConfig || null;
      const equipments = R.pluck('equipmentCode')(R.filter((equipment) => {
        return equipment.selected;
      }, offerSearch.vehicleConfig.vehicleTypeEquipmentList)).join(',');
      const searchConfigKey = offerSearch.id;

      let [lat, lng] = [null, null];

      searchDate = offerSearch.date.time;
      searchKey = searchConfigKey;

      if (regionSignature) {
        promises.push(
          fgApi.getRegionBySignature({pathParams: {signature: regionSignature}}).then((region) => {
            let {lat, lng} = region;
            logger.write(`
${searchConfigKey}, ${mileage}, '${equipments}', ${lat}, ${lng}`);
          })
        );
      } else {
        logger.write(`
${searchConfigKey}, ${mileage}, '${equipments}', ${lat}, ${lng}`);
      }

    }, offerSearches);

    return Promise.all(promises).then(() => {
      console.log(`last searchDate: ${new Date(searchDate)}, for searchKey: ${searchKey}`);
      if (offerSearchesLength === LIMIT) {
        return listOfferSearches(searchDate);
      }
    });
  });
}


fgApi.configure(fgAuth.host);

fgApi
  .login({
    requestBody: {
      username: fgAuth.username,
      password: fgAuth.password
    }
  })
  .then(() => {
    return listOfferSearches();
  })
  .finally(() => {
    logger.end();

    return fgApi.logout();
  })
;
