var wunderlistSDK = require('./wunderlist-sdk');

module.exports = function(RED) {
  function WunderlistCreateList(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.config = RED.nodes.getNode(n.config);

    this.on('input', function(msg, send, done) {
      send = send || function() { node.send.apply(node,arguments) };

      var wunderlistAPI = wunderlistSDK.getApi(node.config, msg);
      var lists = wunderlistAPI.http.lists;

      lists.create({
        'title': n.listTitle || msg.payload
      })
      .done(function (listData, statusCode) {
        msg.listId = listData.id;
        send(msg);
        if (done) {
          done();
        }
      })
      .fail(function (resp, code) {
        var err = resp || 'Wunderlist API error';
        if (done) {
          done(err)
        } else {
          node.error(err);
        }
      });
    });
  }
  RED.nodes.registerType('wunderlist-create-list', WunderlistCreateList);
};