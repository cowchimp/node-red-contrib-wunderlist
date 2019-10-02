var wunderlistSDK = require('./wunderlist-sdk');

module.exports = function(RED) {
  function WunderlistGetComments(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.config = RED.nodes.getNode(n.config);

    this.on('input', function(msg, send, done) {
      send = send || function() { node.send.apply(node,arguments) };

      var wunderlistAPI = wunderlistSDK.getApi(node.config, msg);
      var comments = wunderlistAPI.http.task_comments;

      var listId = n.listId || msg.listId || false;
      var taskId = n.taskId || msg.taskId || false;

      if (taskId){
        comments.forTask(taskId)
        .done((taskCommentsData, statusCode) => {
          msg.payload = taskCommentsData;
          send(msg);
          if (done) {
            done();
          }
        })
        .fail((resp, code) => {
          var err = resp || 'Wunderlist API error';
          if (done) {
            done(err)
          } else {
            node.error(err);
          }
        });
      } else if (listId){
        comments.forList(listId)
        .done((taskCommentsData, statusCode) => {
          msg.payload = taskCommentsData;
          send(msg);
          if (done) {
            done();
          }
        })
        .fail((resp, code) => {
          var err = resp || 'Wunderlist API error';
          if (done) {
            done(err)
          } else {
            node.error(err);
          }
        });
      }
    });
  }
  RED.nodes.registerType('wunderlist-get-comments', WunderlistGetComments);
};
