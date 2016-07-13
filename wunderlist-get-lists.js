var wunderlistSDK = require('./wunderlist-sdk');

module.exports = function(RED) {
  function WunderlistGetLists(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.config = RED.nodes.getNode(n.config);

    this.on('input', function(msg) {
      var wunderlistAPI = wunderlistSDK.getApi(node.config, msg);
      var lists = wunderlistAPI.http.lists;

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