import isArray from 'lodash.isarray';
import CheckTypes from './CheckTypes';

function createCheck(rule, opts) {
  let {defaultCheckType} = opts;
  return isArray(rule) ?
    defaultCheckType(rule) :
    rule;
}

export default createCheck;
