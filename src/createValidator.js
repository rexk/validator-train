import createCheck from './createCheck';
import forIn from 'lodash.forin';
import attempt from 'lodash.attempt';
import isError from 'lodash.iserror';

const ValidationError = 'ValidationError';

const defaultOption = {
  async: true,
  ruleType: {},
  allowExtra: true,
  defaultCheckType: CheckTypes.seriesOf
};

function getDefaultOptions(options = {}) {
  return {
    ...defaultOption,
    ...options
  };
}

function compareString(a, b) {
  return a.localeCompare(b);
}

function checkExtra(obj, checkes) {
  let objKeys = Object.keys(obj);
  let checkKeys = Object.keys(checkes);
  if (objKeys.length != checkKeys) {
    return false;
  }

  objKeys = objKeys.sort(compareString);
  checkKeys = checkKeys.sort(compareString);

  for (let i = 0; i < objKeys.length; i++) {
    if (objKeys[i] != checkKeys[i]) {
      return false;
    }
  }
  return true;
}

function validator(checkes, allowExtra) {
  return function validate(obj) {
    if (allowExtra && !checkExtra(obj, checkes)) {
      throw new Error('Extra fields are fonud');
    }

    let errors = [];
    forIn(checkes, function (check, key) {
      let value = obj[key];
      let err = attempt(check, [value, obj]);
      if (isError(err)) {
        errors.push({
          field: key,
          error: err
        });
      }
    });

    if (errors.length > 0) {
      let err = new Error();
      err.name = ValidationError;
      err.validationErrors = errors;
      throw err;
    }
  };
}

function asyncValidator(checkes, allowExtra) {
  return function validatePromise(obj) {
    if (allowExtra && !checkExtra(obj, checkes)) {
      return Promise.reject(new Error('Extra fields are fonud'));
    }

    let promises = [];
    let errors = [];
    forIn(checkes, (checkPromise, key) => {
      let value = obj[key];
      let promise = checkPromise(value, obj)
        .catch(err => errors.push({
          field: key,
          error: err
        }));
      promises.push(promise);
    });

    return Promise.all(promises)
    .then(() => {
      if (errors.length > 0) {
        let err = new Error();
        err.name = ValidationError;
        err.validationErrors = errors;
        throw err;
      }
    });
  };
}

function getValidator(opts) {
  return opts.async ? validator : asyncValidator;
}


/**
 * createValidator parses given option
 * @param  {object}     options               constructor option object
 * @param  {bool}       options.allowExtra    if set true, validator allow extra field that is not specified under ruleTypes   default: true
 * @param  {bool}       options.async         check if validator includes async check or not. default: true
 * @param  {Object}     options.ruleTypes     key value pair of rule types
 * @return {Function}   Validator function which takes
 */
function createValidator(options) {
  let opts = getDefaultOptions(options);
  let {
    allowExtra,
    ruleTypes
  } = opts;
  let checkes = {};
  forIn(ruleTypes, function (rule, key) {
    checkes[key] = createCheck(rule, opts);
  });
  return getValidator(opts)(checkes, allowExtra);
}

export default createValidator;
