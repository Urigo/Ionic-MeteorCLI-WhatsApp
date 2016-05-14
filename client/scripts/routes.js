import { Meteor } from 'meteor/meteor';
import { Config, Runner } from 'angular-ecmascript/module-helpers';

class RoutesCfg extends Config {
  static $inject = ['$stateProvider', '$urlRouterProvider']

  constructor() {
    super(...arguments);

    this.isAuthorized = ['$auth', this::this.isAuthorized];
  }

  configure() {
    this.$stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'client/templates/tabs.html',
        resolve: {
          user: this.isAuthorized,
          chats() {
            return Meteor.subscribe('chats');
          }
        }
      })
      .state('tab.chat', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'client/templates/chat.html',
            controller: 'ChatCtrl as chat',
          }
        }
      })
      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'client/templates/chats.html',
            controller: 'ChatsCtrl as chats',
          }
        }
      })
      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: 'client/templates/settings.html',
            controller: 'SettingsCtrl as settings',
          }
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'client/templates/login.html',
        controller: 'LoginCtrl as login',
      })
      .state('confirmation', {
        url: '/confirmation/:phone',
        templateUrl: 'client/templates/confirmation.html',
        controller: 'ConfirmationCtrl as confirmation',
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'client/templates/profile.html',
        controller: 'ProfileCtrl as profile',
        resolve: {
          user: this.isAuthorized
        }
      });

    this.$urlRouterProvider.otherwise('tab/chats');
  }

  isAuthorized($auth) {
    return $auth.awaitUser();
  }
}

class RoutesRunner extends Runner {
  static $inject = ['$rootScope', '$state']

  run() {
    this.$rootScope.$on('$stateChangeError', (...args) => {
      const [,,, err] = args

      if (err === 'AUTH_REQUIRED') {
        this.$state.go('login');
      }
    });
  }
}

export default [RoutesCfg, RoutesRunner];