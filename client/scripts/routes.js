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
        template: '<tabs></tabs>',
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
            template: '<chat></chat>'
          }
        }
      })
      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            template: '<chats></chats>'
          }
        }
      })
      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            template: '<settings></settings>'
          }
        }
      })
      .state('login', {
        url: '/login',
        template: '<login></login>'
      })
      .state('confirmation', {
        url: '/confirmation/:phone',
        template: '<confirmation></confirmation>'
      })
      .state('profile', {
        url: '/profile',
        template: '<profile></profile>',
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

export default [RoutesConfig, RoutesRunner];