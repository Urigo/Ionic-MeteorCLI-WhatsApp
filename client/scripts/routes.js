import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Config, Runner } from 'angular-ecmascript/module-helpers';

import chatsTemplateUrl from '../templates/chats.html';
import chatTemplateUrl from '../templates/chat.html';
import confirmationTemplateUrl from '../templates/confirmation.html';
import loginTemplateUrl from '../templates/login.html';
import profileTemplateUrl from '../templates/profile.html';
import settingsTemplateUrl from '../templates/settings.html';
import tabsTemplateUrl from '../templates/tabs.html';

class RoutesConfig extends Config {
  constructor() {
    super(...arguments);

    this.isAuthorized = ['$auth', this.isAuthorized.bind(this)];
  }

  configure() {
    this.$stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: tabsTemplateUrl,
        resolve: {
          user: this.isAuthorized,
          chats() {
            return Meteor.subscribe('chats');
          }
        }
      })
      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: chatsTemplateUrl,
            controller: 'ChatsCtrl as chats'
          }
        }
      })
      .state('tab.chat', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: chatTemplateUrl,
            controller: 'ChatCtrl as chat'
          }
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: loginTemplateUrl,
        controller: 'LoginCtrl as logger'
      })
      .state('confirmation', {
        url: '/confirmation/:phone',
        templateUrl: confirmationTemplateUrl,
        controller: 'ConfirmationCtrl as confirmation'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: profileTemplateUrl,
        controller: 'ProfileCtrl as profile',
        resolve: {
          user: this.isAuthorized
        }
      })
      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: settingsTemplateUrl,
            controller: 'SettingsCtrl as settings',
          }
        }
      });

    this.$urlRouterProvider.otherwise('tab/chats');
  }

  isAuthorized($auth) {
    return $auth.awaitUser();
  }
}

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

class RoutesRunner extends Runner {
  run() {
    this.$rootScope.$on('$stateChangeError', (...args) => {
      const err = _.last(args);

      if (err === 'AUTH_REQUIRED') {
        this.$state.go('login');
      }
    });
  }
}

RoutesRunner.$inject = ['$rootScope', '$state'];

export default [RoutesConfig, RoutesRunner];