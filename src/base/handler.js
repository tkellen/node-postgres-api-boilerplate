export function error (err) {
  if (!Array.isArray(err)) {
    err = [err];
  }
  return {
    errors: err.map(e => {
      const {code, message} = e
      return {
        code,
        message
      };
    })
  };
}

export function success (input) {
  return {
    data: input
  };
}
