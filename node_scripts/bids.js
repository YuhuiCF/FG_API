
const fgApi = require('./fg-api-core');
const fgAuth = require('../auth/fg');
// const Promise = require('bluebird');
const R = require('ramda');

const {log} = require('console');

const fs = require('fs');
const logger = (file) => {
  return fs.createWriteStream(file, {
    flags: 'a' // 'a' means appending (old data will be preserved)
  });
};

const descriptionKeyPrefix = 'description_';


function logBids(bids) {
  const bidsLogger = logger('stage_bid2.csv');

  bidsLogger.write('location_id, id, key, name, description, active, channels, valid_from, valid_to, age_from, age_to, ct_from, ct_to, exclusion, version, created, created_by, superseded, workprices_mechanics, workprices_electronics, workprices_body, workprices_painting, workprices_other, partprices_me, partprices_oe, partprices_lacquer, serviceprice_count, fluid_price_count, vehicle_dimension');

  R.forEach(({active, created, createdBy, description, exclusion, id, key, locationId, name, superseded, version, priceSet, ruleSet}) => {
    // channels
    let channels = [];
    if (ruleSet.channelRule && ruleSet.channelRule.channels) {
      channels = R.map(({id}) => {
        return id;
      }, ruleSet.channelRule.channels);
    }
    if (channels && channels.length) {
      channels = R.map(({id}) => {
        return id;
      }, channels).join(',');
    }

    // valid
    let validFrom;
    let validTo;
    if (ruleSet.dateRule) {
      validFrom = ruleSet.dateRule.from && ruleSet.dateRule.from.time;
      validFrom = validFrom && `"new Date(validFrom)"`;
      validTo = ruleSet.dateRule.to && ruleSet.dateRule.to.time;
      validTo = validTo && `"new Date(validTo)"`;
    }

    // age
    let ageFrom;
    let ageTo;
    if (ruleSet.vehicleAgeRule) {
      ageFrom = ruleSet.vehicleAgeRule.minAge;
      ageTo = ruleSet.vehicleAgeRule.maxAge;
    }

    // valid
    let ctFrom;
    let ctTo;
    if (ruleSet.constructionTimeRule) {
      ctFrom = ruleSet.constructionTimeRule.from && ruleSet.constructionTimeRule.from.time;
      ctFrom = ctFrom && `"new Date(ctFrom)"`;
      ctTo = ruleSet.constructionTimeRule.to && ruleSet.constructionTimeRule.to.time;
      ctTo = ctTo && `"new Date(ctTo)"`;
    }

    // workPrices
    let workPriceMechanics;
    let workPriceElectronics;
    let workPriceBody;
    let workPricePainting;
    let workPriceOther;
    R.forEach(({typeId, price}) => {
      if (typeId === '3469273edcdd6a4a55cda571') {
        workPriceMechanics = price;
      }
      if (typeId === '3469273edcdd6a4a55cda572') {
        workPriceElectronics = price;
      }
      if (typeId === '3469273edcdd6a4a55cda573') {
        workPriceBody = price;
      }
      if (typeId === '3469273edcdd6a4a55cda574') {
        workPricePainting = price;
      }
      if (typeId === '3469273edcdd6a4a55cda575') {
        workPriceOther = price;
      }
    }, priceSet.workPrices);

    // part prices:
    let oePercentage;
    let mePercentage;
    // priceSet.fluidPrices?
    const lacquerMaterialPercentage = priceSet.lacquerMaterialPrice && priceSet.lacquerMaterialPrice.percentage;
    R.forEach(({percentage, typeId}) => {
      if (typeId === '73e34692dc6a4a55cda571da') {
        oePercentage = percentage;
      }
      if (typeId === '73e34692dc6a4a55cda572eb') {
        oePercentage = percentage;
      }
    }, priceSet.partPrices);

    // service price
    const servicePriceCount = priceSet.servicePrices.length;

    // fluid price
    const fluidPriceCount = priceSet.fluidPrices.length;

    // vehicle dimensions
    let vehicleDimensions = [];
    if (ruleSet.vehicleDimensionRule && ruleSet.vehicleDimensionRule.vehicleDimensions) {
      vehicleDimensions = R.map(({externalIds}) => {
        return `[${externalIds.join(',')}]`;
      }, ruleSet.vehicleDimensionRule.vehicleDimensions).join(',');
    }

    bidsLogger.write(`
${locationId}, ${id}, ${key}, "${name}", "${description}", ${active}, "${channels}", ${validFrom}, ${validTo}, ${ageFrom}, ${ageTo}, ${ctFrom}, ${ctTo}, ${exclusion}, ${version}, "${new Date(created.time)}", ${createdBy}, ${superseded}, ${workPriceMechanics}, ${workPriceElectronics}, ${workPriceBody}, ${workPricePainting}, ${workPriceOther}, ${mePercentage}, ${oePercentage}, ${lacquerMaterialPercentage}, ${servicePriceCount}, ${fluidPriceCount}, "${vehicleDimensions}"`);
  }, bids);

  bidsLogger.end();
}

function logBidFluids(bids) {
  const bidFluidsLogger = logger('stage_bid2_fluids.csv');

  bidFluidsLogger.write('id, key, version, description, fluid_product_id, manufacturer, price, product_name, fluid_type_id, fluid_specification_id, specification, standard');

  R.forEach(({id, key, version, priceSet}) => {
    R.forEach(({fluidProductPrices}) => {
      R.forEach(({description, fluidProductId, manufacturer, price, productName, specifications}) => {
        R.forEach(({fluidTypeId, fluidSpecificationId, specification, standard}) => {
          bidFluidsLogger.write(`
${id}, ${key}, ${version}, ${description}, ${fluidProductId}, ${manufacturer}, ${price}, ${productName}, ${fluidTypeId}, ${fluidSpecificationId}, ${specification}, ${standard}`);
        }, specifications);
      }, fluidProductPrices);
    }, priceSet.fluidPrices);
  }, bids);

  bidFluidsLogger.end();
}

function logLocationSurcharges(locationSurcharges) {
  const locationSurchargesLogger = logger('stage_location_surcharge.csv');

  locationSurchargesLogger.write('location_id, id, key, version, surcharge_rule_id, created, created_by, superseded, name, description, absolute, multiple, value, affected_positions');

  R.forEach(({locationId, id, key, version, surchargeRuleId, created, createdBy, superseded, surchargeName, description, absolute, multiple, value, affectedPositions}) => {
    affectedPositions = affectedPositions.join(',');
    locationSurchargesLogger.write(`
${locationId}, ${id}, ${key}, ${version}, ${surchargeRuleId}, "${new Date(created.time)}", ${createdBy}, ${superseded}, "${surchargeName}", "${description}", ${absolute}, ${multiple}, ${value}, "${affectedPositions}"`);
  }, locationSurcharges);

  locationSurchargesLogger.end();
}

function logSurcharges(surcharges) {
  const surchargesLogger = logger('stage_surcharge_rule.csv');

  surchargesLogger.write('id, name, affected_positions, multiple, name_de_DE, name_en_DE, name_de_AT, name_de_CH, name_fr_CH, name_en_GB, name_pl_PL, name_cs_CZ, name_zh_CN, name_ru_RU, description_de_DE, description_en_DE, description_de_AT, description_de_CH, description_fr_CH, description_en_GB, description_pl_PL, description_cs_CZ, description_zh_CN, description_ru_RU');

  R.forEach((surchargeRule) => {
    const {id, name, multiple} = surchargeRule;

    const affectedPositions = surchargeRule.affectedPositions.join(',');

    let translations = initTranslations();
    R.forEach((translation) => {
      const {country, language} = translation;
      translations[`${language}_${country}`] = translation.translation;
    }, surchargeRule.translations);
    const {de_DE, en_DE, de_AT, de_CH, fr_CH, en_GB, pl_PL, cs_CZ, zh_CN, ru_RU} = translations;

    let descriptions = initTranslations(true);
    R.forEach((translation) => {
      const {country, language} = translation;
      descriptions[`${descriptionKeyPrefix}${language}_${country}`] = translation.description;
    }, surchargeRule.translations);
    const {description_de_DE, description_en_DE, description_de_AT, description_de_CH, description_fr_CH, description_en_GB, description_pl_PL, description_cs_CZ, description_zh_CN, description_ru_RU} = descriptions;

    surchargesLogger.write(`
${id}, ${name}, "${affectedPositions}", ${multiple}, "${de_DE}", "${en_DE}", "${de_AT}", "${de_CH}", "${fr_CH}", "${en_GB}", "${pl_PL}", "${cs_CZ}", "${zh_CN}", "${ru_RU}", "${description_de_DE}", "${description_en_DE}", "${description_de_AT}", "${description_de_CH}", "${description_fr_CH}", "${description_en_GB}", "${description_pl_PL}", "${description_cs_CZ}", "${description_zh_CN}", "${description_ru_RU}"`);
  }, surcharges);

  surchargesLogger.end();
}


function listBids() {
  const params = {
    requestParams: {
      active: true,
      superseded: false,
      // locationId: 1038374,
    },
  };
  return fgApi.listBids(params).then((bids) => {
    const locationSurchargesLength = bids.length;
    log(`found ${locationSurchargesLength} bids`);

    logBids(bids);
    logBidFluids(bids);
  });
}

function listLocationSurcharges() {
  const params = {
    requestParams: {},
  };
  return fgApi.listLocationSurcharges(params).then((locationSurcharges) => {
    const locationSurchargesLength = locationSurcharges.length;
    log(`found ${locationSurchargesLength} locationSurcharges`);

    // log(locationSurcharges[0]);
    logLocationSurcharges(locationSurcharges);
  });
}

function listSurcharges() {
  const params = {
    requestParams: {},
  };
  return fgApi.listSurcharges(params).then((surcharges) => {
    const surchargesLength = surcharges.length;
    log(`found ${surchargesLength} surcharges`);

    logSurcharges(surcharges);
  });
}

function initTranslations(description) {
  const prefix = description ? descriptionKeyPrefix : '';
  return {
    [prefix + 'de_DE']: '',
    [prefix + 'en_DE']: '',
    [prefix + 'de_AT']: '',
    [prefix + 'de_CH']: '',
    [prefix + 'fr_CH']: '',
    [prefix + 'en_GB']: '',
    [prefix + 'pl_PL']: '',
    [prefix + 'cs_CZ']: '',
    [prefix + 'zh_CN']: '',
    [prefix + 'ru_RU']: '',
  };
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
    // return listBids();
    // return listLocationSurcharges();
    return listSurcharges();
  })
  .finally(() => {
    return fgApi.logout();
  })
;
