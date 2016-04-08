import ionic from 'ionic-scripts';
import { Controller } from '../entities';

export default class ChatCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.chatId = this.$stateParams.chatId;
    this.isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
    this.isCordova = Meteor.isCordova;

    this.helpers({
      messages() {
        return Messages.find({ chatId: this.chatId });
      },
      data() {
        return Chats.findOne(this.chatId);
      }
    });

    this.autoScroll();
  }

  sendPicture() {
    MeteorCameraUI.getPicture({}, (err, data) => {
      if (err) return this.handleError(err);

      this.callMethod('newMessage', {
        picture: data,
        type: 'picture',
        chatId: this.chatId
      });
    });
  }

  sendMessage() {
    if (_.isEmpty(this.message)) return;

    this.callMethod('newMessage', {
      text: this.message,
      type: 'text',
      chatId: this.chatId
    });

    delete this.message;
  }

  inputUp () {
    if (this.isIOS) {
      this.keyboardHeight = 216;
    }

    this.$timeout(() => {
      this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(true);
    }, 300);
  }

  inputDown () {
    if (this.isIOS) {
      this.keyboardHeight = 0;
    }

    this.$ionicScrollDelegate.$getByHandle('chatScroll').resize();
  }

  closeKeyboard () {
    if (this.isCordova) {
      cordova.plugins.Keyboard.close();
    }
  }

  autoScroll() {
    let recentMessagesNum = this.messages.length;

    this.autorun(() => {
      const currMessagesNum = this.getCollectionReactively('messages').length;
      const animate = recentMessagesNum != currMessagesNum;
      recentMessagesNum = currMessagesNum;

      this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
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

ChatCtrl.$inject = ['$scope', '$stateParams', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$log'];
