module.exports = function(RED) {
  function WunderlistConfigNode(n) {
    RED.nodes.createNode(this, n);
    this.clientId = n.clientId;
    this.accessToken = n.accessToken;
  }
  RED.nodes.registerType('wunderlist-config', WunderlistConfigNode);
};