
function seriesOf(rules = [], isAsync) {
  function checkField(value, obj) {
    rules.forEach(function (rule) {
      rules.call(undefined, value, obj);
    })
  }

  function checkFieldAsync(value, obj) {
    let promises = rules.map(function (rule) {
      return rule.call(undefined, value, obj);
    });
    return Promise.all(promises);
  }

  return !isAsync ? checkField : checkFieldAsync;
}

function parallelOf(rules = [], isAsync) {
  function checkField(value, obj) {
    let errors = [];
    rules.forEach(function (rule) {
      try {
        rule.call(undefined, value, obj);
      } catch (e) {
        errors.push(e);
      }
    });

    if (errors.length > 0) {
      let err = new Error();
      err.name = 'MultipleCheckError';
      err.reasons = errros.map(err => err.message);
      throw err;
    }
  }

  function checkFieldAsync(value, obj) {
    let errors = [];
    let promises = rules.map(rule =>
      rule.call(undefined, value, obj)
        .catch(err => errors.push(err))
    );

    return Promise.all(promises)
      .then(() => {
        if (errors.length > 0) {
          let err = new Error();
          err.name = 'MultipleCheckError';
          err.reasons = errors.map(err => err.message);
        }
        throw err;
      });
  }

  return !isAsync ? checkField : checkFieldAsync;
}

export default {
  seriesOf,
  parallelOf
};
