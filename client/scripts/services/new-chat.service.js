import { Service } from 'angular-ecmascript/module-helpers';

export default class NewChatService extends Service {
  constructor() {
    super(...arguments);

    this.templateUrl = 'client/templates/new-chat.html';
  }

  showModal() {
    this.scope = this.$rootScope.$new();

    this.$ionicModal.fromTemplateUrl(this.templateUrl, {
      scope: this.scope
    })
    .then((modal) => {
      this.modal = modal;
      this.modal.show();
    });
  }

  hideModal() {
    this.scope.$destroy();
    this.modal.remove();
  }
}

NewChatService.$name = 'NewChat';
NewChatService.$inject = ['$rootScope', '$ionicModal'];