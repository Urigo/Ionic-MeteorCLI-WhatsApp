angular
  .module('Whatsapp')
  .controller('ChatsCtrl', ChatsCtrl);

function ChatsCtrl ($scope, $reactive) {
  $reactive(this).attach($scope);
}