angular
  .module('Whatsapp')
  .controller('ChatCtrl', ChatCtrl);

function ChatCtrl ($scope, $reactive, $stateParams) {
  $reactive(this).attach($scope);

  let chatId = $stateParams.chatId;

  this.helpers({
    data() {
      return Chats.findOne(chatId);
    }
  });
}