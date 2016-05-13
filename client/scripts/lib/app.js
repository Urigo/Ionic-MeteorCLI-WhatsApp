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
import Loader from 'angular-ecmascript/module-loader';
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
import Components from '../components';
import Routes from '../routes';

// App
const App = angular.module('Whatsapp', [
  'angular-meteor',
  'angular-meteor.auth',
  'angularMoment',
  'ionic'
]);

// Loader
new Loader(App)
  .load(ChatCtrl)
  .load(ChatsCtrl)
  .load(ConfirmationCtrl)
  .load(LoginCtrl)
  .load(NewChatCtrl)
  .load(ProfileCtrl)
  .load(SettingsCtrl)
  .load(InputDirective)
  .load(CalendarFilter)
  .load(ChatNameFilter)
  .load(ChatPictureFilter)
  .load(NewChatService)
  .load(Components)
  .load(Routes);

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
