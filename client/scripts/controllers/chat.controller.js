angular
  .module('Whatsapp')
  .controller('ChatCtrl', ChatCtrl);

function ChatCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout) {
  $reactive(this).attach($scope);

  let chatId = $stateParams.chatId;
  let isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  this.sendMessage = sendMessage;
  this.inputUp = inputUp;
  this.inputDown = inputDown;
  this.closeKeyboard = closeKeyboard;

  this.helpers({
    messages() {
      return Messages.find({ chatId: chatId });
    },
    data() {
      return Chats.findOne(chatId);
    },
  });

  ////////////

  function sendMessage () {
    if (_.isEmpty(this.message)) return;

    Meteor.call('newMessage', {
      text: this.message,
      type: 'text',
      chatId: chatId
    });

    delete this.message;
  }

  function inputUp () {
    if (isIOS) {
      this.keyboardHeight = 216;
    }

    $timeout(function() {
      $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(true);
    }, 300);
  }

  function inputDown () {
    if (isIOS) {
      this.keyboardHeight = 0;
    }

    $ionicScrollDelegate.$getByHandle('chatScroll').resize();
  }

  function closeKeyboard () {
    // cordova.plugins.Keyboard.close();
  }
}