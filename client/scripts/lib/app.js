// Libs
import angular from 'angular';
import 'angular-animate';
import 'angular-meteor';
import 'angular-meteor-auth';
import 'angular-moment';
import 'angular-sanitize';
import 'angular-ui-router';
import 'ionic-scripts';

// Modules
import Definer from '../definer';
import ChatsCtrl from '../controllers/chats.controller';
import ChatCtrl from '../controllers/chat.controller';
import ConfirmationCtrl from '../controllers/confirmation.controller';
import LoginCtrl from '../controllers/login.controller';
import NewChatCtrl from '../controllers/new-chat.controller';
import ProfileCtrl from '../controllers/profile.controller';
import SettingsCtrl from '../controllers/settings.controller';
import InputDirective from '../directives/input.directive';
import CalendarFilter from '../filters/calendar.filter';
import ChatNameFilter from '../filters/chat-name.filter';
import ChatPictureFilter from '../filters/chat-picture.filter';
import NewChatService from '../services/new-chat.service';
import { RoutesConfig, RoutesRunner } from '../routes';

// App
const App = angular.module('Whatsapp', [
  'angular-meteor',
  'angular-meteor.auth',
  'angularMoment',
  'ionic'
]);

new Definer(App)
  .define(ChatsCtrl)
  .define(ChatCtrl)
  .define(ConfirmationCtrl)
  .define(LoginCtrl)
  .define(NewChatCtrl)
  .define(ProfileCtrl)
  .define(SettingsCtrl)
  .define(InputDirective)
  .define(CalendarFilter)
  .define(ChatNameFilter)
  .define(ChatPictureFilter)
  .define(NewChatService)
  .define(RoutesConfig)
  .define(RoutesRunner);

// Startup
if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
}
else {
  angular.element(document).ready(onReady);
}

function onReady() {
  angular.bootstrap(document, ['Whatsapp']);
}
