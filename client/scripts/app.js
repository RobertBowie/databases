// YOUR CODE HERE:
var app = {};
$(function() {
  app = {
    //GLOBAL VARIABLES;
    server:'http://127.0.0.1:3000',
    username: 'anonymous',
    room: 'lobby',

    //METHODS
    init: function() {
      app.username = window.location.search.substring(10);

      app.$main = $('#main');
      app.$message = $('#message');
      app.$chats = $('#chats');
      app.$roomSelect = $('#roomSelect');
      app.$send = $('#send');

      app.$roomSelect.on('change', app.saveRoom);
      app.$send.on('submit', app.handleSubmit);
      app.$main.on('click', '.username', app.addFriend);

      app.friendList = {};

      app.stopSpinner();
      app.fetch();

      setInterval(app.fetch, 3000);
    },

    saveRoom: function(evt) {
      var selectedIndex = app.$roomSelect.prop('selectedIndex');

      if ( selectedIndex === 0 ) {
        var roomname = prompt('Enter room name');
        if ( roomname ) {
          app.room = roomname;

          app.addRoom(roomname);

          app.$roomSelect.val(roomname);

          app.fetch();
        }
      } else {
        app.room = app.$roomSelect.val();

        app.fetch();
      }
    },

    send: function(message) {
      app.startSpinner();
      $.ajax({
        url: app.server + '/classes/messages',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent. Data: ', data);
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message. Error: ', data);
        },
        complete: function () {
          app.stopSpinner();
        }
      });
    },

    fetch: function() {
      app.startSpinner();
      
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: app.server + '/classes/messages',
        type: 'GET',
        contentType: 'application/json',
        // data: {order: '-createdAt'},
        // where: {createdAt: ">" + app.mostRecent},
        complete: function () {
          app.stopSpinner();
        },
        success: function (data) {
          //we can have function or loop run on data here
          console.log('chatterbox: Message: Data: ', data);//Can be removed later
          app.populateRooms(data.results);//can give this the argument of data.results
          app.populateMessages(data.results);
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to get message. Error: ', data);
        }
      });
    },

    startSpinner: function() {
      $('.spinner img').show();
    },

    stopSpinner: function() {
      $('.spinner img').hide();
    },

    populateRooms: function(results) {
      app.$roomSelect.html('<option value="__newRoom">New Room . . .</option><option value="lobby" selected>Lobby</option>');

      if(results) {
        var processedRooms = {};

        if ( app.room !== 'lobby' ) {
          app.addRoom(app.room);
          processedRooms[app.room];
        }

        results.forEach(function(data) {
          var roomname = data.roomname;
          if(roomname && !processedRooms[roomname] && roomname.charAt(0) !== '<') {
            app.addRoom(roomname);

            processedRooms[roomname] = true;
          }
        });
      }

      app.$roomSelect.val(app.room);
    },

    populateMessages: function(results) {
      app.clearMessages();
      if( Array.isArray(results) ) {
        results.forEach(app.addMessage);
      } 
    },

    clearMessages: function() {
      app.$chats.html('');
    },

    addMessage: function(data) {
      if ( !data.roomname ) {
        data.roomname = "lobby";
      }
      if ( data.roomname === app.room ) {
        var $chat = $('<div class="chat" />');
        var validMessage = !!data.text;
        // var userFirstChar = data.username ? data.username.charAt(0) : null;
        // var validUser = data.username && userFirstChar !== ';' && userFirstChar !== '%' && userFirstChar !== '+';
        if (validMessage) { // && validUser
          var $username = $('<span class = "username" />');
          $username.text(data.username + ': ')
            .attr('data-username', data.username)
            .attr('data-roomname', data.roomname)
            .appendTo($chat);
        if (app.friendList[data.username] === true) {
          $username.addClass('.friend');
        }
          var $message = $('<br /><span />');
          $message.text(data.text)
            .appendTo($chat);

          var $timestamp = $('<span class="timestamp" />');
          $timestamp.text(data.createdAt)
            .appendTo($chat);

          app.$chats.append($chat);
          // var messageText = '<span class = "username">' + data.username + ':  </span>' + data.text
          //   + '<span class="timestamp">' + data.createdAt + '</span>';
          // $('#chats').prepend('<div class="chat">' + messageText + '</div>');
        }
        app.mostRecent = message.createdAt;
      }
    },

    addRoom: function(roomname) {
      var $option = $('<option />').val(roomname).text(roomname);

      app.$roomSelect.append($option);
    },


    addFriend: function(evt) {
      var $username = $(evt.currentTarget).attr('data-username');
      if ($username !== undefined) {
        app.friendList[$username] = true;
      }
      var selector = '[data-username="]' + $username.replace(/"/g, '\\\"') + '"]';
      $(selector).addClass('.friend');
    },

    handleSubmit: function(evt) {
      evt.preventDefault();

      var message = {
        username: app.username,
        roomname: app.room || 'lobby',
        text: app.$message.val()
      };

      app.send(message);
      app.$message.val('');
    }
  };
});


