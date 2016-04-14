
var config = {};

config.mongoURI = {
  development: 'mongodb://localhost/first-mean-app',
  test: 'mongodb://localhost/first-mean-app-testing',
  production: process.env.MONGODB_URI
};

// config.SALT_WORK_FACTOR = {
//   development: 10,
//   test: 10,
//   production: 12
// };

config.SALT_WORK_FACTOR = 10;
config.TOKEN_SECRET = '\xb5>\xe9\xc0*f\xfeO\x81\x0e\xce\xb6\x84\x9e\xe4\xd5\xcd\xda\x0f\x11\x96\x8f\xac\x1c'

module.exports = config;