angular
  .module('Whatsapp')
  .controller('SettingsCtrl', SettingsCtrl);

function SettingsCtrl($scope, $reactive, $state) {
  $reactive(this).attach($scope);

  this.logout = logout;

  ////////////

  function logout() {
    Meteor.logout((err) => {
      $state.go('login');
    });
  }
}