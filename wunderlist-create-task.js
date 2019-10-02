var wunderlistSDK = require('./wunderlist-sdk');

module.exports = function(RED) {
  function WunderlistCreateTask(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.config = RED.nodes.getNode(n.config);

    this.on('input', function(msg, send, done) {
      send = send || function() { node.send.apply(node,arguments) };

      var wunderlistAPI = wunderlistSDK.getApi(node.config, msg);
      var tasks = wunderlistAPI.http.tasks;
      var reminders = wunderlistAPI.http.reminders;

      var params = {
        'list_id': Number(n.listId || msg.listId),
        'title': n.taskTitle || msg.payload
      };
      // Add due date if in msg
      if (msg.dueDate){
        params.due_date = msg.dueDate;
      }

      tasks.create(params)
      .done(function (taskData, statusCode) {
        msg.taskId = taskData.id;
        msg.task = taskData;

        if (!msg.reminderDate) {
          send(msg);
          if (done) {
            done();
          }
        } else {
          var reminderData = {
            'task_id': taskData.id,
            'date': msg.reminderDate
          };
          reminders.create(reminderData)
            .done((reminderData, status) => {
              msg.reminder = reminderData;
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
            })
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
  RED.nodes.registerType('wunderlist-create-task', WunderlistCreateTask);
};
