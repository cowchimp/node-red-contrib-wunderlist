var WunderlistSDK = require('wunderlist');

module.exports = function(RED) {
  function WunderlistGetLists(n) {
    RED.nodes.createNode(this, n);
    var node = this;

    this.config = RED.nodes.getNode(n.config);
    if (!this.config) {
      this.error(RED._('Wunderlist account is not configured'));
    }
    this.wunderlistAPI = new WunderlistSDK({
      'accessToken': this.config.accessToken,
      'clientID': this.config.clientId
    });

    this.on('input', function(msg) {
      var lists = this.wunderlistAPI.http.lists;

      lists.all()
        .done(function (listsData, statusCode) {
          msg.payload = listsData;
          node.send(msg);
        })
        .fail(function (resp, code) {
          node.error(resp || 'Wunderlist API error');
        });
    });
  }
  RED.nodes.registerType('wunderlist-get-lists', WunderlistGetLists);
};