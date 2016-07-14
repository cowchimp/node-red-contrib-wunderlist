var wunderlistSDK = require('./wunderlist-sdk');

module.exports = function(RED) {
  function WunderlistCreateList(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.config = RED.nodes.getNode(n.config);

    this.on('input', function(msg) {
      var wunderlistAPI = wunderlistSDK.getApi(node.config, msg);
      var lists = wunderlistAPI.http.lists;

      lists.create({
        'title': n.listTitle || msg.payload
      })
      .done(function (listData, statusCode) {
        msg.listId = listData.id;
        node.send(msg);
      })
      .fail(function (resp, code) {
        node.error(resp || 'Wunderlist API error');
      });
    });
  }
  RED.nodes.registerType('wunderlist-create-list', WunderlistCreateList);
};