import { Controller } from '../entities';

export default class ChatsCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.helpers({
      data() {
        return Chats.find();
      }
    });
  }

  remove(chat) {
    this.data.splice(this.data.indexOf(chat), 1);
  }
}

ChatsCtrl.$inject = ['$scope'];