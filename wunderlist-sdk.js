var WunderlistSDK = require('wunderlist');

exports.getApi = function(config, msg) {
  return new WunderlistSDK({
    'clientID': config.clientId,
    'accessToken': config.accessToken || msg.wunderlistAccessToken
  });
};