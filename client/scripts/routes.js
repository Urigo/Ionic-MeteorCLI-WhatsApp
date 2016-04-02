import { Config } from 'angular-ecmascript/module-helpers';

import chatsTemplateUrl from '../templates/chats.html';
import chatTemplateUrl from '../templates/chat.html';
import confirmationTemplateUrl from '../templates/confirmation.html';
import loginTemplateUrl from '../templates/login.html';
import profileTemplateUrl from '../templates/profile.html';
import tabsTemplateUrl from '../templates/tabs.html';

export default class RoutesConfig extends Config {
  configure() {
    this.$stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: tabsTemplateUrl
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
        controller: 'ProfileCtrl as profile'
      });

    this.$urlRouterProvider.otherwise('tab/chats');
  }
}

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];