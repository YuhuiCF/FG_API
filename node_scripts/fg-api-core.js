'use strict';

let fgApiCoreModule = {
    configure,

    createBid,
    createMailTemplates,
    deleteBid,
    getOffer,
    getOfferDetail,
    getRegionBySignature,
    getSearch,
    listBids,
    listBookedOfferHistories,
    listBookedOffers,
    listBookedOfferVersions,
    listBriefOffers,
    listCalculations,
    listFluidProducts,
    listFluidSpecifications,
    listFluidTypes,
    listLocationSurcharges,
    listLoggings,
    listMailTrackings,
    listOffers,
    listOfferSearches,
    listSurcharges,
    listValuations,
    login,
    logout,
};

const rp = require('request-promise');
const Promise = require('bluebird');
const _ = require('lodash');

let apiPrefix,
    sessionId
;

const contextKey = 'BIhYGSk-DlrnijwhGHI-FwoS4etKfqi';
const defaultOptions = {
    qs: {
        contextKey: contextKey
    },
    json: true
};


function appendSession() {
    return sessionId ? (';jsessionid=' + sessionId) : '';
}

function getMergedFgOptions(options) {
    return _.merge(_.cloneDeep(defaultOptions), options);
}

function request(options) {
    return new Promise((resolve, reject) => {
        rp(options).then((response) => {
            resolve(response);
        }, (err) => {
            reject(err);
        });
    });
}



function configure(fgHost) {
    apiPrefix = fgHost + '/smp/api/';
}

function createBid(params) {
    const bid = params.requestBody;

    const options = getMergedFgOptions({
        body: bid,
        method: 'POST',
        uri: setUri('bids2/bids')
    });

    return request(options);
}

function createMailTemplates(params) {
    const body = params.requestBody;
    const mailconfigId = params.mailconfigId;

    const options = getMergedFgOptions({
        body,
        method: 'POST',
        uri: setUri('mailconfigs/' + mailconfigId + '/templates')
    });

    return request(options);
}

function deleteBid(params) {
    const bidKey = params.pathParams.bidKey;

    const options = getMergedFgOptions({
        method: 'DELETE',
        uri: setUri('bids2/bids/' + bidKey)
    });

    return request(options);
}

function getOffer(params) {
    const offerKey = params.pathParams.offerKey;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('offer2/offers/' + offerKey)
    });

    return request(options);
}

function getOfferDetail(params) {
    const offerKey = params.pathParams.offerKey;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('offer2/offers_brief/' + offerKey + '/detail')
    });

    return request(options);
}

function getRegionBySignature(params) {
    const signature = params.pathParams.signature;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('regions/signature/' + signature)
    });

    return request(options);
}

function getSearch(params) {
    const searchConfigKey = params.pathParams.searchConfigKey;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('offer2/offersearches/' + searchConfigKey)
    });

    return request(options);
}

function listBids(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('bids2/bids'),
        qs: requestParams
    });

    return request(options);
}

function listBookedOfferHistories(params) {
    const bookedOfferKey = params.pathParams.bookedOfferKey;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('bookedoffers2/' + bookedOfferKey + '/history')
    });

    return request(options);
}

function listBookedOffers(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('bookedoffers2'),
        qs: requestParams
    });

    return request(options);
}

function listBookedOfferVersions(params) {
    const bookedOfferKey = params.pathParams.bookedOfferKey;
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('bookedoffers2/' + bookedOfferKey + '/versions'),
        qs: requestParams
    });

    return request(options);
}

function listBriefOffers(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('offer2/offers_brief'),
        qs: requestParams
    });

    return request(options);
}

function listCalculations(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('offer2/calculations'),
        qs: requestParams
    });

    return request(options);
}

function listFluidProducts(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('bids/fluidproducts'),
        qs: requestParams
    });

    return request(options);
}

function listFluidSpecifications(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('bids/fluidspecifications'),
        qs: requestParams
    });

    return request(options);
}

function listFluidTypes(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('fluidtypes'),
        qs: requestParams
    });

    return request(options);
}

function listLocationSurcharges(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('bids2/surcharges'),
        qs: requestParams
    });

    return request(options);
}

function listLoggings(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('loggings'),
        qs: requestParams
    });

    return request(options);
}

function listMailTrackings(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('mail/trackings'),
        qs: requestParams
    });

    return request(options);
}

function listOffers(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('offer2/offers'),
        qs: requestParams
    });

    return request(options);
}

function listOfferSearches(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('offer2/offersearches'),
        qs: requestParams
    });

    return request(options);
}

function listSurcharges(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('surcharges'),
        qs: requestParams
    });

    return request(options);
}

function listValuations(params) {
    const requestParams = params.requestParams;

    const options = getMergedFgOptions({
        method: 'GET',
        uri: setUri('vehicles/evaluation2'),
        qs: requestParams
    });

    return request(options);
}

function login(params) {
    const body = params.requestBody;

    const options = getMergedFgOptions({
        body: body,
        method: 'POST',
        uri: setUri('authentication/login/admin')
    });

    return request(options).then((user) => {
        sessionId = user.sessionId;
        return Promise.resolve(user);
    }, (err) => {
        return Promise.reject(err);
    });
}

function logout() {
    const options = getMergedFgOptions({
        method: 'DELETE',
        uri: setUri('authentication/current'),
    });

    return request(options).then(() => {
        sessionId = null;
        return Promise.resolve();
    }, (err) => {
        return Promise.reject(err);
    });
}

function setUri(url, ...replacers) {
    const replacersLength = replacers.length;

    if (replacersLength) {
        const keys = url.match(/{(\w)+}/g);

        if (keys.length) {
            _.each(keys, (key, index) => {
                if (index < replacersLength) {
                    url = url.replace(key, replacers[index]);
                }
            });
        }
    }

    return apiPrefix + url + appendSession();
}


module.exports = fgApiCoreModule;
