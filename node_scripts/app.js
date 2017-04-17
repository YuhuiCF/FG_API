
const fgApi = require('./fg-api-core');
const fgAuth = require('../auth/fg');
const newBids = require('./bids');
const Promise = require('bluebird');

const locationIds = [1038374, 1059199, 1072961, 1323754, 1063988];



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
    let currentBidsOfLocations = [];

    locationIds.forEach((locationId) => {
      const params = {
        requestParams: {locationId: locationId}
      };

      promises.push(
        fgApi.listBids(params).then((bids) => {
          currentBidsOfLocations = currentBidsOfLocations.concat(bids);
        })
      );
    });

    return Promise.all(promises).then(() => {
      let deleteBidPromises = Promise.resolve();

      console.log('number of bids: ' + currentBidsOfLocations.length);
      currentBidsOfLocations.forEach((bid) => {
        //console.log(bid);
        const params = {
          pathParams: {bidKey: bid.key}
        };

        deleteBidPromises = deleteBidPromises.then(() => {
          console.log('deleting bid ' + bid.key);
          return fgApi.deleteBid(params);
        });
      });

      return deleteBidPromises;
    });
  })
  .then(() => {
    let createBidPromise = Promise.resolve();

    newBids.forEach((bid) => {
      const params = {
        requestBody: bid
      };

      createBidPromise = createBidPromise.finally(() => {
        console.log('creating bid for: locationId ' + bid.locationId + ', name ' + bid.name + ', description ' + bid.description);
        return fgApi.createBid(params).catch((err) => {
          console.log('creating bid failed for: locationId ' + bid.locationId + ', name ' + bid.name + ', description ' + bid.description);
          return Promise.reject(err);
        });
      });
    });

    return createBidPromise;
  })
  .then(() => {
    let promises = [];
    let currentBidsOfLocations = [];

    locationIds.forEach((locationId) => {
      const params = {
        requestParams: {locationId: locationId}
      };

      promises.push(
        fgApi.listBids(params).then((bids) => {
          currentBidsOfLocations = currentBidsOfLocations.concat(bids);
        })
      );
    });

    return Promise.all(promises).then(() => {
      console.log('number of bids: ' + currentBidsOfLocations.length);
    });
  })
  .finally(() => {
    return fgApi.logout();
  });
