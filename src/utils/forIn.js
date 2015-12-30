function forIn(obj, iterator) {
  let keys = Object.keys(obj);
  keys.forEach(function (key) {
    let value = obj[keys];
    iterator.call(null, value, key);
  });
}

export default forIn;
