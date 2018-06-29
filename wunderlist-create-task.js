var wunderlistSDK = require('./wunderlist-sdk');

module.exports = function(RED) {
  function WunderlistCreateTask(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.config = RED.nodes.getNode(n.config);

    this.on('input', function(msg) {
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

        // If a reminder is defined
        if (msg.reminder_date){
          var reminderData = {
            'task_id' : taskData.id,
            'date' : msg.reminder_date
          }
          reminders.create(reminderData)
          .done((reminderData, status) => {
            msg.reminder = reminderData;
            node.send(msg);
          })
          .fail((resp,code) => {
            //Delete if it fails to create reminder
            tasks.deleteID(taskData.id, 1)
            .always((resp, code) => {
              //Nothing
            })
            node.error(resp || 'Wunderlist API error');
          })
        } else {
          node.send(msg);
        }
      })
      .fail(function (resp, code) {
        node.error(resp || 'Wunderlist API error');
      });
    });
  }
  RED.nodes.registerType('wunderlist-create-task', WunderlistCreateTask);
};
