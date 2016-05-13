import { Config } from 'angular-ecmascript/module-helpers';

export default class ComponentsConfig extends Config {
  static $inject = ['$compileProvider']

  configure() {
    this.$compileProvider
      .component('tabs', {
        templateUrl: 'client/templates/tabs.html',
      })
      .component('chat', {
        templateUrl: 'client/templates/chat.html',
        controller: 'ChatCtrl',
        controllerAs: 'chat'
      })
      .component('chats', {
        templateUrl: 'client/templates/chats.html',
        controller: 'ChatsCtrl',
        controllerAs: 'chats'
      })
      .component('settings', {
        templateUrl: 'client/templates/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings'
      })
      .component('login', {
        templateUrl: 'client/templates/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .component('confirmation', {
        templateUrl: 'client/templates/confirmation.html',
        controller: 'ConfirmationCtrl',
        controllerAs: 'confirmation'
      })
      .component('profile', {
        templateUrl: 'client/templates/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      });
  }
}