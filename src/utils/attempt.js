function attempt(fn, args) {
  try {
    return fn.apply(undefined, args);
  } catch (e) {
    return e instanceof Error ? e : new Error(e);
  }
}

export default attempt;
