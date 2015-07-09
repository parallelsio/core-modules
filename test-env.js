for (var envVariable in process.env) {
  if (envVariable.indexOf('LESS_') === 0) {
    console.log(envVariable.substring(5, envVariable.length));
  }
}
