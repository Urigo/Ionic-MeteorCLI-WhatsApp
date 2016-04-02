import { Controller } from '../entities';

export default class ChatCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.chatId = this.$stateParams.chatId;

    this.helpers({
      data() {
        return Chats.findOne(this.chatId);
      }
    });
  }
}

ChatCtrl.$inject = ['$scope', '$stateParams'];