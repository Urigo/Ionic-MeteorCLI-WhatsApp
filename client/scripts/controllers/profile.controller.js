import { Controller } from '../entities';

export default class ProfileCtrl extends Controller {
  constructor() {
    super(...arguments);

    const profile = this.currentUser && this.currentUser.profile;
    this.name = profile ? profile.name : '';
  }

  updatePicture () {
    MeteorCameraUI.getPicture({ width: 60, height: 60 }, (err, data) => {
      if (err) return this.handleError(err);

      this.$ionicLoading.show({
        template: 'Updating picture...'
      });

      this.callMethod('updatePicture', data, (err) => {
        this.$ionicLoading.hide();
        this.handleError(err);
      });
    });
  }

  updateName() {
    if (_.isEmpty(this.name)) return;

    this.callMethod('updateName', this.name, (err) => {
      if (err) return this.handleError(err);
      this.$state.go('tab.chats');
    });
  }

  handleError(err) {
    if (err.error == 'cancel') return;
    this.$log.error('Profile save error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'Save failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
}

ProfileCtrl.$inject = ['$scope', '$state', '$ionicPopup', '$log'];