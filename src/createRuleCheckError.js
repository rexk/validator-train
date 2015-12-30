const RuleCheckError = 'RuleCheckError';

function createRuleCheckError(msg, field) {
  let err = new Error(msg);
  err.name = RuleCheckError;
  err.field = field;
  return err;
}
