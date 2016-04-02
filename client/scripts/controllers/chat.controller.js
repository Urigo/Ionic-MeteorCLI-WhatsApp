import { Controller } from 'angular-ecmascript/module-helpers';
import { Chats } from '../../../lib/collections';

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

ChatCtrl.$inject = ['$stateParams'];