[{]: <region> (header)
# Step 5: Create and remove chats
[}]: #
[{]: <region> (body)
Our next step is about adding new chats. So far we have the chats list implemented and user management, we just need to connect the two.

We will open the new chat view using `Ionic`'s modal dialog, so first let's add a button that opens this dialog to the chats list:

[{]: <helper> (diff_step 5.1)
#### Step 5.1: Add new chat button

##### Changed client/templates/chats.html
```diff
@@ -1,4 +1,8 @@
 ┊1┊1┊<ion-view view-title="Chats">
+┊ ┊2┊  <ion-nav-buttons side="right">
+┊ ┊3┊    <button ng-click="chats.showNewChatModal()" class="button button-clear button-positive button-icon ion-ios-compose-outline"></button>
+┊ ┊4┊  </ion-nav-buttons>
+┊ ┊5┊
 ┊2┊6┊  <ion-content>
 ┊3┊7┊    <ion-list>
 ┊4┊8┊      <ion-item ng-repeat="chat in chats.data | orderBy:'-lastMessage.timestamp'"
```
[}]: #

This button calls a controller method, which we will implement now in the controller:

[{]: <helper> (diff_step 5.2)
#### Step 5.2: Add new chat button logic

##### Changed client/scripts/controllers/chats.controller.js
```diff
@@ -12,9 +12,14 @@
 ┊12┊12┊    });
 ┊13┊13┊  }
 ┊14┊14┊
+┊  ┊15┊  showNewChatModal() {
+┊  ┊16┊    this.NewChat.showModal();
+┊  ┊17┊  }
+┊  ┊18┊
 ┊15┊19┊  remove(chat) {
 ┊16┊20┊    Chats.remove(chat._id);
 ┊17┊21┊  }
 ┊18┊22┊}
 ┊19┊23┊
-┊20┊  ┊ChatsCtrl.$name = 'ChatsCtrl';🚫↵
+┊  ┊24┊ChatsCtrl.$name = 'ChatsCtrl';
+┊  ┊25┊ChatsCtrl.$inject = ['NewChat'];
```
[}]: #

Note that we first create the modal dialog with a template, and later on we will implement the logic of showing it on screen.

Now let's add the view of this modal dialog, which is just a list of users:

[{]: <helper> (diff_step 5.3)
#### Step 5.3: Add new chat modal view

##### Added client/templates/new-chat.html
```diff
@@ -0,0 +1,19 @@
+┊  ┊ 1┊<ion-modal-view ng-controller="NewChatCtrl as chat">
+┊  ┊ 2┊  <ion-header-bar>
+┊  ┊ 3┊    <h1 class="title">New Chat</h1>
+┊  ┊ 4┊    <div class="buttons">
+┊  ┊ 5┊      <button class="button button-clear button-positive" ng-click="chat.hideNewChatModal()">Cancel</button>
+┊  ┊ 6┊    </div>
+┊  ┊ 7┊  </ion-header-bar>
+┊  ┊ 8┊
+┊  ┊ 9┊  <ion-content>
+┊  ┊10┊    <div class="list">
+┊  ┊11┊      <a ng-repeat="user in chat.users" ng-click="chat.newChat(user._id)" class="item">
+┊  ┊12┊        <h2>{{ user.profile.name }}</h2>
+┊  ┊13┊        <p>
+┊  ┊14┊          Hey there! I am using meteor-Whatsapp with meteor.
+┊  ┊15┊        </p>
+┊  ┊16┊      </a>
+┊  ┊17┊    </div>
+┊  ┊18┊  </ion-content>
+┊  ┊19┊</ion-modal-view>🚫↵
```
[}]: #

And in order to open this modal, we will create a service that takes care of it:

[{]: <helper> (diff_step 5.4)
#### Step 5.4: Create new chat service

##### Added client/scripts/services/new-chat.service.js
```diff
@@ -0,0 +1,31 @@
+┊  ┊ 1┊import { Service } from 'angular-ecmascript/module-helpers';
+┊  ┊ 2┊
+┊  ┊ 3┊import newChatTemplateUrl from '../../templates/new-chat.html';
+┊  ┊ 4┊
+┊  ┊ 5┊export default class NewChatService extends Service {
+┊  ┊ 6┊  constructor() {
+┊  ┊ 7┊    super(...arguments);
+┊  ┊ 8┊
+┊  ┊ 9┊    this.templateUrl = newChatTemplateUrl;
+┊  ┊10┊  }
+┊  ┊11┊
+┊  ┊12┊  showModal() {
+┊  ┊13┊    this.scope = this.$rootScope.$new();
+┊  ┊14┊
+┊  ┊15┊    this.$ionicModal.fromTemplateUrl(this.templateUrl, {
+┊  ┊16┊      scope: this.scope
+┊  ┊17┊    })
+┊  ┊18┊    .then((modal) => {
+┊  ┊19┊      this.modal = modal;
+┊  ┊20┊      this.modal.show();
+┊  ┊21┊    });
+┊  ┊22┊  }
+┊  ┊23┊
+┊  ┊24┊  hideModal() {
+┊  ┊25┊    this.scope.$destroy();
+┊  ┊26┊    this.modal.remove();
+┊  ┊27┊  }
+┊  ┊28┊}
+┊  ┊29┊
+┊  ┊30┊NewChatService.$name = 'NewChat';
+┊  ┊31┊NewChatService.$inject = ['$rootScope', '$ionicModal'];🚫↵
```
[}]: #

[{]: <helper> (diff_step 5.5)
#### Step 5.5: Load new chat service

##### Changed client/scripts/lib/app.js
```diff
@@ -19,6 +19,7 @@
 ┊19┊19┊import SettingsCtrl from '../controllers/settings.controller';
 ┊20┊20┊import InputDirective from '../directives/input.directive';
 ┊21┊21┊import CalendarFilter from '../filters/calendar.filter';
+┊  ┊22┊import NewChatService from '../services/new-chat.service';
 ┊22┊23┊import Routes from '../routes';
 ┊23┊24┊
 ┊24┊25┊const App = 'Whatsapp';
```
```diff
@@ -40,6 +41,7 @@
 ┊40┊41┊  .load(SettingsCtrl)
 ┊41┊42┊  .load(InputDirective)
 ┊42┊43┊  .load(CalendarFilter)
+┊  ┊44┊  .load(NewChatService)
 ┊43┊45┊  .load(Routes);
 ┊44┊46┊
 ┊45┊47┊// Startup
```
[}]: #

And now we will add the controller of this view, and use the `NewChat` service:

[{]: <helper> (diff_step 5.6)
#### Step 5.6: Add new chat controller

##### Added client/scripts/controllers/new-chat.controller.js
```diff
@@ -0,0 +1,51 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 3┊import { Chats } from '../../../lib/collections';
+┊  ┊ 4┊
+┊  ┊ 5┊export default class NewChatCtrl extends Controller {
+┊  ┊ 6┊  constructor() {
+┊  ┊ 7┊    super(...arguments);
+┊  ┊ 8┊
+┊  ┊ 9┊    this.helpers({
+┊  ┊10┊      users() {
+┊  ┊11┊        return Meteor.users.find({ _id: { $ne: this.currentUserId } });
+┊  ┊12┊      }
+┊  ┊13┊    });
+┊  ┊14┊  }
+┊  ┊15┊
+┊  ┊16┊  newChat(userId) {
+┊  ┊17┊    let chat = Chats.findOne({ userIds: { $all: [this.currentUserId, userId] } });
+┊  ┊18┊
+┊  ┊19┊    if (chat) {
+┊  ┊20┊      this.hideNewChatModal();
+┊  ┊21┊      return this.goToChat(chat._id);
+┊  ┊22┊    }
+┊  ┊23┊
+┊  ┊24┊    this.callMethod('newChat', userId, (err, chatId) => {
+┊  ┊25┊      this.hideNewChatModal();
+┊  ┊26┊      if (err) return this.handleError(err);
+┊  ┊27┊      this.goToChat(chatId);
+┊  ┊28┊    });
+┊  ┊29┊  }
+┊  ┊30┊
+┊  ┊31┊  hideNewChatModal() {
+┊  ┊32┊    this.NewChat.hideModal();
+┊  ┊33┊  }
+┊  ┊34┊
+┊  ┊35┊  goToChat(chatId) {
+┊  ┊36┊    this.$state.go('tab.chat', { chatId });
+┊  ┊37┊  }
+┊  ┊38┊
+┊  ┊39┊  handleError(err) {
+┊  ┊40┊    this.$log.error('New chat creation error ', err);
+┊  ┊41┊
+┊  ┊42┊    this.$ionicPopup.alert({
+┊  ┊43┊      title: err.reason || 'New chat creation failed',
+┊  ┊44┊      template: 'Please try again',
+┊  ┊45┊      okType: 'button-positive button-clear'
+┊  ┊46┊    });
+┊  ┊47┊  }
+┊  ┊48┊}
+┊  ┊49┊
+┊  ┊50┊NewChatCtrl.$name = 'NewChatCtrl';
+┊  ┊51┊NewChatCtrl.$inject = ['$state', 'NewChat', '$ionicPopup', '$log'];🚫↵
```
[}]: #

[{]: <helper> (diff_step 5.7)
#### Step 5.7: Load new chat controller

##### Changed client/scripts/lib/app.js
```diff
@@ -15,6 +15,7 @@
 ┊15┊15┊import ChatCtrl from '../controllers/chat.controller';
 ┊16┊16┊import ConfirmationCtrl from '../controllers/confirmation.controller';
 ┊17┊17┊import LoginCtrl from '../controllers/login.controller';
+┊  ┊18┊import NewChatCtrl from '../controllers/new-chat.controller';
 ┊18┊19┊import ProfileCtrl from '../controllers/profile.controller';
 ┊19┊20┊import SettingsCtrl from '../controllers/settings.controller';
 ┊20┊21┊import InputDirective from '../directives/input.directive';
```
```diff
@@ -37,6 +38,7 @@
 ┊37┊38┊  .load(ChatCtrl)
 ┊38┊39┊  .load(ConfirmationCtrl)
 ┊39┊40┊  .load(LoginCtrl)
+┊  ┊41┊  .load(NewChatCtrl)
 ┊40┊42┊  .load(ProfileCtrl)
 ┊41┊43┊  .load(SettingsCtrl)
 ┊42┊44┊  .load(InputDirective)
```
[}]: #

It includes the users collection and a function for creating a new chat. This function is not yet implemented in the server, so let's create it:

[{]: <helper> (diff_step 5.8)
#### Step 5.8: Add new chat method

##### Changed lib/methods.js
```diff
@@ -35,5 +35,28 @@
 ┊35┊35┊    }
 ┊36┊36┊
 ┊37┊37┊    return Meteor.users.update(this.userId, { $set: { 'profile.name': name } });
+┊  ┊38┊  },
+┊  ┊39┊  newChat(otherId) {
+┊  ┊40┊    if (!this.userId) {
+┊  ┊41┊      throw new Meteor.Error('not-logged-in',
+┊  ┊42┊        'Must be logged to create a chat.');
+┊  ┊43┊    }
+┊  ┊44┊
+┊  ┊45┊    check(otherId, String);
+┊  ┊46┊    const otherUser = Meteor.users.findOne(otherId);
+┊  ┊47┊
+┊  ┊48┊    if (!otherUser) {
+┊  ┊49┊      throw new Meteor.Error('user-not-exists',
+┊  ┊50┊        'Chat\'s user not exists');
+┊  ┊51┊    }
+┊  ┊52┊
+┊  ┊53┊    const chat = {
+┊  ┊54┊      userIds: [this.userId, otherId],
+┊  ┊55┊      createdAt: new Date()
+┊  ┊56┊    };
+┊  ┊57┊
+┊  ┊58┊    const chatId = Chats.insert(chat);
+┊  ┊59┊
+┊  ┊60┊    return chatId;
 ┊38┊61┊  }
 ┊39┊62┊});🚫↵
```
[}]: #

We will also rewrite the logic of `removeChat()` function in the `ChatsCtrl` and we will call a server method instead (which will be explained why further in this tutorial):

[{]: <helper> (diff_step 5.9)
#### Step 5.9: Call remove chat method

##### Changed client/scripts/controllers/chats.controller.js
```diff
@@ -17,7 +17,7 @@
 ┊17┊17┊  }
 ┊18┊18┊
 ┊19┊19┊  remove(chat) {
-┊20┊  ┊    Chats.remove(chat._id);
+┊  ┊20┊    this.callMethod('removeChat', chat._id);
 ┊21┊21┊  }
 ┊22┊22┊}
```
[}]: #

And we will implement the method on the server:

[{]: <helper> (diff_step 5.10)
#### Step 5.10: Add remove chat method

##### Changed lib/methods.js
```diff
@@ -58,5 +58,24 @@
 ┊58┊58┊    const chatId = Chats.insert(chat);
 ┊59┊59┊
 ┊60┊60┊    return chatId;
+┊  ┊61┊  },
+┊  ┊62┊  removeChat(chatId) {
+┊  ┊63┊    if (!this.userId) {
+┊  ┊64┊      throw new Meteor.Error('not-logged-in',
+┊  ┊65┊        'Must be logged to remove a chat.');
+┊  ┊66┊    }
+┊  ┊67┊
+┊  ┊68┊    check(chatId, String);
+┊  ┊69┊
+┊  ┊70┊    const chat = Chats.findOne(chatId);
+┊  ┊71┊
+┊  ┊72┊    if (!chat || !_.include(chat.userIds, this.userId)) {
+┊  ┊73┊      throw new Meteor.Error('chat-not-exists',
+┊  ┊74┊        'Chat not exists');
+┊  ┊75┊    }
+┊  ┊76┊
+┊  ┊77┊    Messages.remove({ chatId: chatId });
+┊  ┊78┊
+┊  ┊79┊    return Chats.remove({ _id: chatId });
 ┊61┊80┊  }
 ┊62┊81┊});🚫↵
```
[}]: #

The next messages won't include the username, only the user id, so we need to change the logic of username display. We will add a filter that fetches the user object from the users collection according to the `userId` property of the chat object:

[{]: <helper> (diff_step 5.11)
#### Step 5.11: Create chat name filter

##### Added client/scripts/filters/chat-name.filter.js
```diff
@@ -0,0 +1,17 @@
+┊  ┊ 1┊import { _ } from 'meteor/underscore';
+┊  ┊ 2┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 3┊import { Filter } from 'angular-ecmascript/module-helpers';
+┊  ┊ 4┊
+┊  ┊ 5┊export default class ChatNameFilter extends Filter {
+┊  ┊ 6┊  filter(chat) {
+┊  ┊ 7┊    if (!chat) return;
+┊  ┊ 8┊
+┊  ┊ 9┊    let otherId = _.without(chat.userIds, Meteor.userId())[0];
+┊  ┊10┊    let otherUser = Meteor.users.findOne(otherId);
+┊  ┊11┊    let hasName = otherUser && otherUser.profile && otherUser.profile.name;
+┊  ┊12┊
+┊  ┊13┊    return hasName ? otherUser.profile.name : chat.name || 'NO NAME';
+┊  ┊14┊  }
+┊  ┊15┊}
+┊  ┊16┊
+┊  ┊17┊ChatNameFilter.$name = 'chatName';
```
[}]: #

[{]: <helper> (diff_step 5.12)
#### Step 5.12: Load chat name filter

##### Changed client/scripts/lib/app.js
```diff
@@ -20,6 +20,7 @@
 ┊20┊20┊import SettingsCtrl from '../controllers/settings.controller';
 ┊21┊21┊import InputDirective from '../directives/input.directive';
 ┊22┊22┊import CalendarFilter from '../filters/calendar.filter';
+┊  ┊23┊import ChatNameFilter from '../filters/chat-name.filter';
 ┊23┊24┊import NewChatService from '../services/new-chat.service';
 ┊24┊25┊import Routes from '../routes';
 ┊25┊26┊
```
```diff
@@ -43,6 +44,7 @@
 ┊43┊44┊  .load(SettingsCtrl)
 ┊44┊45┊  .load(InputDirective)
 ┊45┊46┊  .load(CalendarFilter)
+┊  ┊47┊  .load(ChatNameFilter)
 ┊46┊48┊  .load(NewChatService)
 ┊47┊49┊  .load(Routes);
```
[}]: #

And we will also create the same logic for fetching the user's image:

[{]: <helper> (diff_step 5.13)
#### Step 5.13: Create chat picture filter

##### Added client/scripts/filters/chat-picture.filter.js
```diff
@@ -0,0 +1,17 @@
+┊  ┊ 1┊import { _ } from 'meteor/underscore';
+┊  ┊ 2┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 3┊import { Filter } from 'angular-ecmascript/module-helpers';
+┊  ┊ 4┊
+┊  ┊ 5┊export default class ChatPictureFilter extends Filter {
+┊  ┊ 6┊  filter(chat) {
+┊  ┊ 7┊    if (!chat) return;
+┊  ┊ 8┊
+┊  ┊ 9┊    let otherId = _.without(chat.userIds, Meteor.userId())[0];
+┊  ┊10┊    let otherUser = Meteor.users.findOne(otherId);
+┊  ┊11┊    let hasPicture = otherUser && otherUser.profile && otherUser.profile.picture;
+┊  ┊12┊
+┊  ┊13┊    return hasPicture ? otherUser.profile.picture : chat.picture || '/user-default.svg';
+┊  ┊14┊  };
+┊  ┊15┊}
+┊  ┊16┊
+┊  ┊17┊ChatPictureFilter.$name = 'chatPicture';🚫↵
```
[}]: #

[{]: <helper> (diff_step 5.14)
#### Step 5.14: Load chat picture filter

##### Changed client/scripts/lib/app.js
```diff
@@ -21,6 +21,7 @@
 ┊21┊21┊import InputDirective from '../directives/input.directive';
 ┊22┊22┊import CalendarFilter from '../filters/calendar.filter';
 ┊23┊23┊import ChatNameFilter from '../filters/chat-name.filter';
+┊  ┊24┊import ChatPictureFilter from '../filters/chat-picture.filter';
 ┊24┊25┊import NewChatService from '../services/new-chat.service';
 ┊25┊26┊import Routes from '../routes';
 ┊26┊27┊
```
```diff
@@ -45,6 +46,7 @@
 ┊45┊46┊  .load(InputDirective)
 ┊46┊47┊  .load(CalendarFilter)
 ┊47┊48┊  .load(ChatNameFilter)
+┊  ┊49┊  .load(ChatPictureFilter)
 ┊48┊50┊  .load(NewChatService)
 ┊49┊51┊  .load(Routes);
```
[}]: #

And we will add the usage of this filter in the chats list:

[{]: <helper> (diff_step 5.15)
#### Step 5.15: Apply chat filters in chats view

##### Changed client/templates/chats.html
```diff
@@ -9,8 +9,8 @@
 ┊ 9┊ 9┊                class="item-chat item-remove-animate item-avatar item-icon-right"
 ┊10┊10┊                type="item-text-wrap"
 ┊11┊11┊                href="#/tab/chats/{{ chat._id }}">
-┊12┊  ┊        <img ng-src="{{ chat.picture }}">
-┊13┊  ┊        <h2>{{ chat.name }}</h2>
+┊  ┊12┊        <img ng-src="{{ chat | chatPicture }}">
+┊  ┊13┊        <h2>{{ chat | chatName }}</h2>
 ┊14┊14┊        <p>{{ chat.lastMessage.text }}</p>
 ┊15┊15┊        <span class="last-message-timestamp">{{ chat.lastMessage.timestamp | calendar }}</span>
 ┊16┊16┊        <i class="icon ion-chevron-right icon-accessory"></i>
```
[}]: #

And in the chat view:

[{]: <helper> (diff_step 5.16)
#### Step 5.16: Apply chat filters in chat view

##### Changed client/templates/chat.html
```diff
@@ -1,6 +1,6 @@
-┊1┊ ┊<ion-view title="{{ chat.data.name }}">
+┊ ┊1┊<ion-view title="{{ chat.data | chatName }}">
 ┊2┊2┊  <ion-nav-buttons side="right">
-┊3┊ ┊    <button class="button button-clear"><img class="header-picture" ng-src="{{ chat.data.picture }}"></button>
+┊ ┊3┊    <button class="button button-clear"><img class="header-picture" ng-src="{{ chat.data | chatPicture }}"></button>
 ┊4┊4┊  </ion-nav-buttons>
 ┊5┊5┊  <ion-content class="chat" delegate-handle="chatScroll">
 ┊6┊6┊    <div class="message-list">
```
[}]: #

Now we want to get rid of the current data we have, which is just a static data.

So let's stop our `Meteor`'s server and reset the whole app by running:

    $ meteor reset

Let's add some users to the server instead of the old static data:

[{]: <helper> (diff_step 5.17)
#### Step 5.17: Create users with phone data stub

##### Changed server/bootstrap.js
```diff
@@ -1,66 +1,27 @@
-┊ 1┊  ┊import Moment from 'moment';
 ┊ 2┊ 1┊import { Meteor } from 'meteor/meteor';
-┊ 3┊  ┊import { Chats, Messages } from '../lib/collections';
+┊  ┊ 2┊import { Accounts } from 'meteor/accounts-base';
 ┊ 4┊ 3┊
 ┊ 5┊ 4┊Meteor.startup(function() {
-┊ 6┊  ┊  if (Chats.find().count() !== 0) return;
+┊  ┊ 5┊  if (Meteor.users.find().count() != 0) return;
 ┊ 7┊ 6┊
-┊ 8┊  ┊  Messages.remove({});
-┊ 9┊  ┊
-┊10┊  ┊  const messages = [
-┊11┊  ┊    {
-┊12┊  ┊      text: 'You on your way?',
-┊13┊  ┊      timestamp: Moment().subtract(1, 'hours').toDate()
-┊14┊  ┊    },
-┊15┊  ┊    {
-┊16┊  ┊      text: 'Hey, it\'s me',
-┊17┊  ┊      timestamp: Moment().subtract(2, 'hours').toDate()
-┊18┊  ┊    },
-┊19┊  ┊    {
-┊20┊  ┊      text: 'I should buy a boat',
-┊21┊  ┊      timestamp: Moment().subtract(1, 'days').toDate()
-┊22┊  ┊    },
-┊23┊  ┊    {
-┊24┊  ┊      text: 'Look at my mukluks!',
-┊25┊  ┊      timestamp: Moment().subtract(4, 'days').toDate()
-┊26┊  ┊    },
-┊27┊  ┊    {
-┊28┊  ┊      text: 'This is wicked good ice cream.',
-┊29┊  ┊      timestamp: Moment().subtract(2, 'weeks').toDate()
+┊  ┊ 7┊  Accounts.createUserWithPhone({
+┊  ┊ 8┊    phone: '+972501234567',
+┊  ┊ 9┊    profile: {
+┊  ┊10┊      name: 'My friend 1'
 ┊30┊11┊    }
-┊31┊  ┊  ];
-┊32┊  ┊
-┊33┊  ┊  messages.forEach((m) => {
-┊34┊  ┊    Messages.insert(m);
 ┊35┊12┊  });
 ┊36┊13┊
-┊37┊  ┊  const chats = [
-┊38┊  ┊    {
-┊39┊  ┊      name: 'Ethan Gonzalez',
-┊40┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
-┊41┊  ┊    },
-┊42┊  ┊    {
-┊43┊  ┊      name: 'Bryan Wallace',
-┊44┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
-┊45┊  ┊    },
-┊46┊  ┊    {
-┊47┊  ┊      name: 'Avery Stewart',
-┊48┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
-┊49┊  ┊    },
-┊50┊  ┊    {
-┊51┊  ┊      name: 'Katie Peterson',
-┊52┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
-┊53┊  ┊    },
-┊54┊  ┊    {
-┊55┊  ┊      name: 'Ray Edwards',
-┊56┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
+┊  ┊14┊  Accounts.createUserWithPhone({
+┊  ┊15┊    phone: '+972501234568',
+┊  ┊16┊    profile: {
+┊  ┊17┊      name: 'My friend 2'
 ┊57┊18┊    }
-┊58┊  ┊  ];
+┊  ┊19┊  });
 ┊59┊20┊
-┊60┊  ┊  chats.forEach((chat) => {
-┊61┊  ┊    const message = Messages.findOne({ chatId: { $exists: false } });
-┊62┊  ┊    chat.lastMessage = message;
-┊63┊  ┊    const chatId = Chats.insert(chat);
-┊64┊  ┊    Messages.update(message._id, { $set: { chatId } });
+┊  ┊21┊  Accounts.createUserWithPhone({
+┊  ┊22┊    phone: '+972501234569',
+┊  ┊23┊    profile: {
+┊  ┊24┊      name: 'My friend 3'
+┊  ┊25┊    }
 ┊65┊26┊  });
 ┊66┊27┊});🚫↵
```
[}]: #

Run it again.

Cool! and now clicking a user will open a chat with that user.

Our last part of this step is to remove `Meteor`'s package named `insecure`.

This package provides the ability to run `remove()` method from the client side in our collection. This is a behavior we do not want to use because removing data and creating data should be done in the server and only after certain validations, and this is the reason for implementing the `removeChat()` method in the server.

`Meteor` includes this package only for development purposes and it should be removed once our app is ready for production.

So remove this package by running this command:

    $ meteor remove insecure

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step4.md) | [Next Step >](step6.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #