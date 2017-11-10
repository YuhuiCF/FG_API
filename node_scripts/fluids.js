
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

const fluidProductsLogger = logger('stage_fluid_product.csv');
const fluidProductsCountryLogger = logger('stage_fluid_product_country.csv');
const fluidProductsSpecificationLogger = logger('stage_fluid_product_specification.csv');

const fluidSpecificationsLogger = logger('stage_fluid_specification.csv');
const fluidTypesLogger = logger('stage_fluid_type.csv');


function listFluidProducts() {
  const LIMIT = 10000;
  const params = {
    requestParams: {
      max: LIMIT,
      start: 0,
    },
  };
  return fgApi.listFluidProducts(params).then((fluidProducts) => {
    const fluidProductsLength = fluidProducts.length;
    log(`found ${fluidProductsLength} fluidProducts, LIMIT is ${LIMIT}`);

    fluidProductsLogger.write('id, fluid_type_id, manufacturer, name_de_DE, name_en_DE, name_de_AT, name_de_CH, name_fr_CH, name_en_GB, name_pl_PL, name_cs_CZ, name_zh_CN, name_ru_RU');
    fluidProductsCountryLogger.write('fluid_product_id, country_code');
    fluidProductsSpecificationLogger.write('fluid_product_id, fluid_specification_id');

    R.forEach(({countryCodes, fluidTypeId, id, manufacturer, names, specificationIds}) => {
      R.forEach((countryCode) => {
        fluidProductsCountryLogger.write(`
${id}, ${countryCode}`);
      }, countryCodes);

      R.forEach((specificationId) => {
        fluidProductsSpecificationLogger.write(`
${id}, ${specificationId}`);
      }, specificationIds);


      let translations = initTranslations();
      R.forEach((name) => {
        const {country, language, translation} = name;
        translations[`${language}_${country}`] = translation;
      }, names);

      const {de_DE, en_DE, de_AT, de_CH, fr_CH, en_GB, pl_PL, cs_CZ, zh_CN, ru_RU} = translations;

      fluidProductsLogger.write(`
${id}, ${fluidTypeId}, ${manufacturer}, ${de_DE}, ${en_DE}, ${de_AT}, ${de_CH}, ${fr_CH}, ${en_GB}, ${pl_PL}, ${cs_CZ}, ${zh_CN}, ${ru_RU}`);
    }, fluidProducts);
  });
}

function listFluidSpecifications() {
  const LIMIT = 2000;
  const params = {
    requestParams: {
      max: LIMIT,
      start: 0,
    },
  };
  return fgApi.listFluidSpecifications(params).then((fluidSpecifications) => {
    const fluidSpecificationsLength = fluidSpecifications.length;
    log(`found ${fluidSpecificationsLength} fluidSpecifications, LIMIT is ${LIMIT}`);

    fluidSpecificationsLogger.write('id, fluid_type_id, standard, specification');

    R.forEach(({fluidTypeId, id, specification, standard}) => {
      fluidSpecificationsLogger.write(`
${id}, ${fluidTypeId}, ${standard}, ${specification}`);
    }, fluidSpecifications);
  });
}


function listFluidTypes() {
  return fgApi.listFluidTypes({}).then((fluidTypes) => {
    const fluidTypesLength = fluidTypes.length;
    log(`found ${fluidTypesLength} fluidTypes`);

    fluidTypesLogger.write('id, type, unit, de_DE, en_DE, de_AT, de_CH, fr_CH, en_GB, pl_PL, cs_CZ, zh_CN, ru_RU');

    R.forEach((fluidType) => {
      const {id, type, unit} = fluidType;
      let translations = initTranslations();

      R.forEach((translation) => {
        const {country, language} = translation;
        translations[`${language}_${country}`] = translation.translation;
      }, fluidType.translations);

      const {de_DE, en_DE, de_AT, de_CH, fr_CH, en_GB, pl_PL, cs_CZ, zh_CN, ru_RU} = translations;

      fluidTypesLogger.write(`
${id}, ${type}, ${unit}, ${de_DE}, ${en_DE}, ${de_AT}, ${de_CH}, ${fr_CH}, ${en_GB}, ${pl_PL}, ${cs_CZ}, ${zh_CN}, ${ru_RU}`);
    }, fluidTypes);
  });
}

function initTranslations() {
  return {
    de_DE: '',
    en_DE: '',
    de_AT: '',
    de_CH: '',
    fr_CH: '',
    en_GB: '',
    pl_PL: '',
    cs_CZ: '',
    zh_CN: '',
    ru_RU: '',
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
    return listFluidProducts();
  })
  .then(() => {
    return listFluidSpecifications();
  })
  .then(() => {
    return listFluidTypes();
  })
  .finally(() => {
    fluidTypesLogger.end();

    return fgApi.logout();
  })
;
