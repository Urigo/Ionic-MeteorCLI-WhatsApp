angular
  .module('Whatsapp')
  .controller('ConfirmationCtrl', ConfirmationCtrl);

function ConfirmationCtrl($scope, $reactive, $state, $ionicPopup, $log) {
  $reactive(this).attach($scope);

  this.phone = $state.params.phone;
  this.confirm = confirm;

  ////////////

  function confirm() {
    if (_.isEmpty(this.code)) return;

    Accounts.verifyPhone(this.phone, this.code, function (err) {
      if (err) return handleError(err);
      $state.go('profile');
    });
  }

  function handleError(err) {
    $log.error('Verfication error ', err);

    $ionicPopup.alert({
      title: err.reason || 'Verfication failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
}