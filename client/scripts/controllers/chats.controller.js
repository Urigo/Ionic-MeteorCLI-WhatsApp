angular
  .module('Whatsapp')
  .controller('ChatsCtrl', ChatsCtrl);

function ChatsCtrl ($scope, $reactive) {
  $reactive(this).attach($scope);

  this.remove = remove;

  this.helpers({
    data() {
      return Chats.find();
    }
  });

  ////////////

  function remove (chat) {
    this.data.splice(this.data.indexOf(chat), 1);
  }
}