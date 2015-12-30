import forIn from './utils/forIn';
import Validator from './Validator';

class AsyncValidator extends Validator {
  validate(obj) {
    let promises = [];
    let errors = [];
    forIn(this.checkes, (checkPromise, key) => {
      let value = obj[key];
      let promise = checkPromise(value, obj)
        .catch(err => errors.push(err));
      promises.push(promise);
    });

    return Promise.all(promises)
    .then(() => {
      if (errors.length > 0) {
        let err = new Error();
        err.validationErrors = errors;
        throw err;
      }
    });
  }
}

export default AsyncValidator;
