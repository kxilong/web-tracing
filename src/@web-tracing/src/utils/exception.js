export function nativeTryCatch(fn, errorFn) {
  try {
    fn();
  } catch (err) {
    if (errorFn) {
      errorFn(err);
    }
  }
}
