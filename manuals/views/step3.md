[{]: <region> (header)
# Step 3: Chat view and send messages
[}]: #
[{]: <region> (body)
In this step we will add the chat view and the ability to send messages.

We still don't have an identity for each user, we will add it later, but we can still send messages to existing chats.

So just like any other page, first we need to add a route and a state.

Let's call it `chat` and we will load a template and a controller which we will add later.

[{]: <helper> (diff_step 3.1)
#### Step 3.1: Add chat route state

##### Changed client/scripts/routes.js
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import { Config } from 'angular-ecmascript/module-helpers';
 ┊2┊2┊
 ┊3┊3┊import chatsTemplateUrl from '../templates/chats.html';
+┊ ┊4┊import chatTemplateUrl from '../templates/chat.html';
 ┊4┊5┊import tabsTemplateUrl from '../templates/tabs.html';
 ┊5┊6┊
 ┊6┊7┊export default class RoutesConfig extends Config {
```
```diff
@@ -19,6 +20,15 @@
 ┊19┊20┊            controller: 'ChatsCtrl as chats'
 ┊20┊21┊          }
 ┊21┊22┊        }
+┊  ┊23┊      })
+┊  ┊24┊      .state('tab.chat', {
+┊  ┊25┊        url: '/chats/:chatId',
+┊  ┊26┊        views: {
+┊  ┊27┊          'tab-chats': {
+┊  ┊28┊            templateUrl: chatTemplateUrl,
+┊  ┊29┊            controller: 'ChatCtrl as chat'
+┊  ┊30┊          }
+┊  ┊31┊        }
 ┊22┊32┊      });
 ┊23┊33┊
 ┊24┊34┊    this.$urlRouterProvider.otherwise('tab/chats');
```
[}]: #

Let's add a very basic view with the chat's details. The file will be located in `client/templates/chat.html`:

[{]: <helper> (diff_step 3.2)
#### Step 3.2: Add chat view

##### Added client/templates/chat.html
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊<ion-view title="{{chat.data.name}}">
+┊ ┊2┊  <ion-nav-buttons side="right">
+┊ ┊3┊    <button class="button button-clear"><img class="header-picture" ng-src="{{chat.data.picture}}"></button>
+┊ ┊4┊  </ion-nav-buttons>
+┊ ┊5┊</ion-view>🚫↵
```
[}]: #

Now we need to implement the logic in the controller, so let's create it in `client/scripts/controllers/chat.controller.js` and call it `ChatCtrl`.

We will use the `$stateParams` provider to get the chat id and then we will define a helper that will help us fetch the chat that we want.

So in order to do that we shall define a helper named `chat`, and use `findOne()` to fetch the wanted document.

[{]: <helper> (diff_step 3.3)
#### Step 3.3: Add chat controller

##### Added client/scripts/controllers/chat.controller.js
```diff
@@ -0,0 +1,19 @@
+┊  ┊ 1┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 2┊import { Chats } from '../../../lib/collections';
+┊  ┊ 3┊
+┊  ┊ 4┊export default class ChatCtrl extends Controller {
+┊  ┊ 5┊  constructor() {
+┊  ┊ 6┊    super(...arguments);
+┊  ┊ 7┊
+┊  ┊ 8┊    this.chatId = this.$stateParams.chatId;
+┊  ┊ 9┊
+┊  ┊10┊    this.helpers({
+┊  ┊11┊      data() {
+┊  ┊12┊        return Chats.findOne(this.chatId);
+┊  ┊13┊      }
+┊  ┊14┊    });
+┊  ┊15┊  }
+┊  ┊16┊}
+┊  ┊17┊
+┊  ┊18┊ChatCtrl.$name = 'ChatCtrl';
+┊  ┊19┊ChatCtrl.$inject = ['$stateParams'];🚫↵
```
[}]: #

[{]: <helper> (diff_step 3.4)
#### Step 3.4: Load chat controller

##### Changed client/scripts/lib/app.js
```diff
@@ -10,6 +10,7 @@
 ┊10┊10┊
 ┊11┊11┊// Modules
 ┊12┊12┊import ChatsCtrl from '../controllers/chats.controller';
+┊  ┊13┊import ChatCtrl from '../controllers/chat.controller';
 ┊13┊14┊import CalendarFilter from '../filters/calendar.filter';
 ┊14┊15┊import RoutesConfig from '../routes';
 ┊15┊16┊
```
```diff
@@ -23,6 +24,7 @@
 ┊23┊24┊
 ┊24┊25┊new Loader(App)
 ┊25┊26┊  .load(ChatsCtrl)
+┊  ┊27┊  .load(ChatCtrl)
 ┊26┊28┊  .load(CalendarFilter)
 ┊27┊29┊  .load(RoutesConfig);
```
[}]: #

So now that we have the chat view and controller, all is left to do is to link these two:

[{]: <helper> (diff_step 3.5)
#### Step 3.5: Add reference to chat view in chats view

##### Changed client/templates/chats.html
```diff
@@ -3,7 +3,8 @@
 ┊ 3┊ 3┊    <ion-list>
 ┊ 4┊ 4┊      <ion-item ng-repeat="chat in chats.data | orderBy:'-lastMessage.timestamp'"
 ┊ 5┊ 5┊                class="item-chat item-remove-animate item-avatar item-icon-right"
-┊ 6┊  ┊                type="item-text-wrap">
+┊  ┊ 6┊                type="item-text-wrap"
+┊  ┊ 7┊                href="#/tab/chats/{{ chat._id }}">
 ┊ 7┊ 8┊        <img ng-src="{{ chat.picture }}">
 ┊ 8┊ 9┊        <h2>{{ chat.name }}</h2>
 ┊ 9┊10┊        <p>{{ chat.lastMessage.text }}</p>
```
[}]: #

Now let's add some `css` rules and let's add the messages view.

Let's create a new `sass` file for our view at `client/styles/chat.scss`, and fix the image style so it won't look silly:

[{]: <helper> (diff_step 3.6)
#### Step 3.6: Add chat stylesheet

##### Added client/styles/chat.scss
```diff
@@ -0,0 +1,7 @@
+┊ ┊1┊.header-picture {
+┊ ┊2┊  max-width: 33px;
+┊ ┊3┊  max-height: 33px;
+┊ ┊4┊  width: 100%;
+┊ ┊5┊  height: 100%;
+┊ ┊6┊  border-radius: 50%;
+┊ ┊7┊}🚫↵
```
[}]: #

Our next step is about getting the chat's messages in the controller, we will add another helper, but instead of using the whole collection we will fetch only the relevant messages:

[{]: <helper> (diff_step 3.7)
#### Step 3.7: Add messages helper to chat controller

##### Changed client/scripts/controllers/chat.controller.js
```diff
@@ -1,5 +1,5 @@
 ┊1┊1┊import { Controller } from 'angular-ecmascript/module-helpers';
-┊2┊ ┊import { Chats } from '../../../lib/collections';
+┊ ┊2┊import { Chats, Messages } from '../../../lib/collections';
 ┊3┊3┊
 ┊4┊4┊export default class ChatCtrl extends Controller {
 ┊5┊5┊  constructor() {
```
```diff
@@ -8,6 +8,9 @@
 ┊ 8┊ 8┊    this.chatId = this.$stateParams.chatId;
 ┊ 9┊ 9┊
 ┊10┊10┊    this.helpers({
+┊  ┊11┊      messages() {
+┊  ┊12┊        return Messages.find({ chatId: this.chatId });
+┊  ┊13┊      },
 ┊11┊14┊      data() {
 ┊12┊15┊        return Chats.findOne(this.chatId);
 ┊13┊16┊      }
```
[}]: #

And now to add it to the view, we use `ng-repeat` to iterate the messages:

[{]: <helper> (diff_step 3.8)
#### Step 3.8: Add messages to chat view

##### Changed client/templates/chat.html
```diff
@@ -1,5 +1,15 @@
-┊ 1┊  ┊<ion-view title="{{chat.data.name}}">
+┊  ┊ 1┊<ion-view title="{{ chat.data.name }}">
 ┊ 2┊ 2┊  <ion-nav-buttons side="right">
-┊ 3┊  ┊    <button class="button button-clear"><img class="header-picture" ng-src="{{chat.data.picture}}"></button>
+┊  ┊ 3┊    <button class="button button-clear"><img class="header-picture" ng-src="{{ chat.data.picture }}"></button>
 ┊ 4┊ 4┊  </ion-nav-buttons>
+┊  ┊ 5┊  <ion-content class="chat" delegate-handle="chatScroll">
+┊  ┊ 6┊    <div class="message-list">
+┊  ┊ 7┊      <div ng-repeat="message in chat.messages" class="message-wrapper">
+┊  ┊ 8┊        <div class="message" ng-class-even="'message-mine'" ng-class-odd="'message-other'">
+┊  ┊ 9┊          <div class="message-text">{{ message.text }}</div>
+┊  ┊10┊          <span class="message-timestamp">{{ message.timestamp }}</span>
+┊  ┊11┊        </div>
+┊  ┊12┊      </div>
+┊  ┊13┊    </div>
+┊  ┊14┊  </ion-content>
 ┊ 5┊15┊</ion-view>🚫↵
```
[}]: #

As for now we do not have an identity for each user or message, so we will just use `odd`/`even` classes and this will be the indication for which message is mine and which isn't. In the next step we will add the authentication and each message will be related to a user.

Now we will add some `css` to the messages list:

[{]: <helper> (diff_step 3.9)
#### Step 3.9: Add message style to chat stylesheet

##### Changed client/styles/chat.scss
```diff
@@ -4,4 +4,83 @@
 ┊ 4┊ 4┊  width: 100%;
 ┊ 5┊ 5┊  height: 100%;
 ┊ 6┊ 6┊  border-radius: 50%;
+┊  ┊ 7┊}
+┊  ┊ 8┊
+┊  ┊ 9┊.chat {
+┊  ┊10┊  background-image: url(/chat-background.jpg);
+┊  ┊11┊  background-color: #E0DAD6;
+┊  ┊12┊  background-repeat: no-repeat;
+┊  ┊13┊  background-size: 100%;
+┊  ┊14┊}
+┊  ┊15┊
+┊  ┊16┊.message-list {
+┊  ┊17┊  margin-top: 12px;
+┊  ┊18┊  padding: 0 5%;
+┊  ┊19┊}
+┊  ┊20┊
+┊  ┊21┊.message-wrapper {
+┊  ┊22┊  margin-bottom: 9px;
+┊  ┊23┊
+┊  ┊24┊  &::after {
+┊  ┊25┊    content: "";
+┊  ┊26┊    display: table;
+┊  ┊27┊    clear: both;
+┊  ┊28┊  }
+┊  ┊29┊}
+┊  ┊30┊
+┊  ┊31┊.message {
+┊  ┊32┊  display: inline-block;
+┊  ┊33┊  position: relative;
+┊  ┊34┊  max-width: 236px;
+┊  ┊35┊  border-radius: 7px;
+┊  ┊36┊  box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
+┊  ┊37┊
+┊  ┊38┊  &.message-mine {
+┊  ┊39┊    float: right;
+┊  ┊40┊    background-color: #DCF8C6;
+┊  ┊41┊  }
+┊  ┊42┊
+┊  ┊43┊  &.message-other {
+┊  ┊44┊    float: left;
+┊  ┊45┊    background-color: #FFF;
+┊  ┊46┊  }
+┊  ┊47┊
+┊  ┊48┊  &.message-other::before, &.message-mine::before, {
+┊  ┊49┊    content: "";
+┊  ┊50┊    position: absolute;
+┊  ┊51┊    bottom: 3px;
+┊  ┊52┊    width: 12px;
+┊  ┊53┊    height: 19px;
+┊  ┊54┊    background-position: 50% 50%;
+┊  ┊55┊    background-repeat: no-repeat;
+┊  ┊56┊    background-size: contain;
+┊  ┊57┊  }
+┊  ┊58┊
+┊  ┊59┊  &.message-other::before {
+┊  ┊60┊    left: -11px;
+┊  ┊61┊    background-image: url(/message-other.png)
+┊  ┊62┊  }
+┊  ┊63┊
+┊  ┊64┊  &.message-mine::before {
+┊  ┊65┊    right: -11px;
+┊  ┊66┊    background-image: url(/message-mine.png)
+┊  ┊67┊  }
+┊  ┊68┊
+┊  ┊69┊  .message-text {
+┊  ┊70┊    padding: 5px 7px;
+┊  ┊71┊    word-wrap: break-word;
+┊  ┊72┊
+┊  ┊73┊    &::after {
+┊  ┊74┊      content: " \00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0";
+┊  ┊75┊      display: inline;
+┊  ┊76┊    }
+┊  ┊77┊  }
+┊  ┊78┊
+┊  ┊79┊  .message-timestamp {
+┊  ┊80┊    position: absolute;
+┊  ┊81┊    bottom: 2px;
+┊  ┊82┊    right: 7px;
+┊  ┊83┊    color: gray;
+┊  ┊84┊    font-size: 12px;
+┊  ┊85┊  }
 ┊ 7┊86┊}🚫↵
```
[}]: #

We also need to add some `Whatsapp` assets so it would look more similar.

Note that the images are under `public/` folder so we can use them in the client side from the root directory (in the `css` file).

You can copy them from [here](https://github.com/Urigo/Ionic-MeteorCLI-WhatsApp/tree/master/public).

Now we just need to take care of the message timestamp and format it.

We will use `moment` like before, but now let's add another package called [angular-moment](https://github.com/urish/angular-moment) that provides us the UI filters.

So adding the package is just like any other package we added so far:

    $ meteor npm install angular-moment --save

And since it's an `AngularJS` extension, we need to add a dependency in our module definition:

[{]: <helper> (diff_step 3.12)
#### Step 3.12: Load angular-moment

##### Changed client/scripts/lib/app.js
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊// Libs
 ┊2┊2┊import 'angular-animate';
 ┊3┊3┊import 'angular-meteor';
+┊ ┊4┊import 'angular-moment';
 ┊4┊5┊import 'angular-sanitize';
 ┊5┊6┊import 'angular-ui-router';
 ┊6┊7┊import 'ionic-scripts';
```
```diff
@@ -19,6 +20,7 @@
 ┊19┊20┊// App
 ┊20┊21┊Angular.module(App, [
 ┊21┊22┊  'angular-meteor',
+┊  ┊23┊  'angularMoment',
 ┊22┊24┊  'ionic'
 ┊23┊25┊]);
```
[}]: #

And now we will use a filter from this package in our view:

[{]: <helper> (diff_step 3.13)
#### Step 3.13: Add moment filter to chat view

##### Changed client/templates/chat.html
```diff
@@ -7,7 +7,7 @@
 ┊ 7┊ 7┊      <div ng-repeat="message in chat.messages" class="message-wrapper">
 ┊ 8┊ 8┊        <div class="message" ng-class-even="'message-mine'" ng-class-odd="'message-other'">
 ┊ 9┊ 9┊          <div class="message-text">{{ message.text }}</div>
-┊10┊  ┊          <span class="message-timestamp">{{ message.timestamp }}</span>
+┊  ┊10┊          <span class="message-timestamp">{{ message.timestamp | amDateFormat: 'HH:mm' }}</span>
 ┊11┊11┊        </div>
 ┊12┊12┊      </div>
 ┊13┊13┊    </div>
```
[}]: #

Just like `Whatsapp`...

Our next step is about adding the input for adding a new message to the chat, we need to add an input at the bottom of the view. `ion-footer-bar` provides a perfect solution for that.

So we will add an input, a send button and some icons for sending images and sound recordings (For now we will live them just so our view would look reach without any logic implemented behind).

[{]: <helper> (diff_step 3.14)
#### Step 3.14: Add chatbox to chat view

##### Changed client/templates/chat.html
```diff
@@ -12,4 +12,22 @@
 ┊12┊12┊      </div>
 ┊13┊13┊    </div>
 ┊14┊14┊  </ion-content>
+┊  ┊15┊  <ion-footer-bar keyboard-attach class="bar-stable footer-chat item-input-inset">
+┊  ┊16┊    <button class="button button-clear button-icon button-positive icon ion-ios-upload-outline"></button>
+┊  ┊17┊
+┊  ┊18┊    <label class="item-input-wrapper">
+┊  ┊19┊      <input ng-model="chat.message"
+┊  ┊20┊             dir="auto"
+┊  ┊21┊             type="text"/>
+┊  ┊22┊    </label>
+┊  ┊23┊
+┊  ┊24┊    <span ng-if="chat.message.length > 0">
+┊  ┊25┊      <button ng-click="chat.sendMessage()" class="button button-clear button-positive">Send</button>
+┊  ┊26┊    </span>
+┊  ┊27┊    <span ng-if="!chat.message || chat.message.length === 0">
+┊  ┊28┊      <button class="button button-clear button-icon button-positive icon ion-ios-camera-outline"></button>
+┊  ┊29┊      <i class="buttons-seperator icon ion-android-more-vertical"></i>
+┊  ┊30┊      <button class="button button-clear button-icon button-positive icon ion-ios-mic-outline"></button>
+┊  ┊31┊    </span>
+┊  ┊32┊  </ion-footer-bar>
 ┊15┊33┊</ion-view>🚫↵
```
[}]: #

Let's add the `data` object to our controller, and add a stub method for `sendMessage()`, which will be implemented further in this tutorial.

[{]: <helper> (diff_step 3.15)
#### Step 3.15: Add chatbox logic to chat controller

##### Changed client/scripts/controllers/chat.controller.js
```diff
@@ -16,6 +16,9 @@
 ┊16┊16┊      }
 ┊17┊17┊    });
 ┊18┊18┊  }
+┊  ┊19┊
+┊  ┊20┊  sendMessage() {
+┊  ┊21┊  }
 ┊19┊22┊}
 ┊20┊23┊
 ┊21┊24┊ChatCtrl.$name = 'ChatCtrl';
```
[}]: #


To improve the user experience in our app, we want some extra events to our input because we want to move it up when the keyboard comes from the bottom of the screen and we want to know if the `return` button (aka `Enter`) was pressed.

We will implement a new directive that extends the regular `input` tag and add those events to the directive:

[{]: <helper> (diff_step 3.16)
#### Step 3.16: Add input directive

##### Added client/scripts/directives/input.directive.js
```diff
@@ -0,0 +1,51 @@
+┊  ┊ 1┊import { Directive } from 'angular-ecmascript/module-helpers';
+┊  ┊ 2┊
+┊  ┊ 3┊export default class InputDirective extends Directive {
+┊  ┊ 4┊  constructor() {
+┊  ┊ 5┊    super(...arguments);
+┊  ┊ 6┊
+┊  ┊ 7┊    this.restrict = 'E';
+┊  ┊ 8┊
+┊  ┊ 9┊    this.scope = {
+┊  ┊10┊      'returnClose': '=',
+┊  ┊11┊      'onReturn': '&',
+┊  ┊12┊      'onFocus': '&',
+┊  ┊13┊      'onBlur': '&'
+┊  ┊14┊    };
+┊  ┊15┊  }
+┊  ┊16┊
+┊  ┊17┊  link(scope, element) {
+┊  ┊18┊    element.bind('focus', (e) => {
+┊  ┊19┊      if (!scope.onFocus) return;
+┊  ┊20┊
+┊  ┊21┊      this.$timeout(() => {
+┊  ┊22┊        scope.onFocus();
+┊  ┊23┊      });
+┊  ┊24┊    });
+┊  ┊25┊
+┊  ┊26┊    element.bind('blur', (e) => {
+┊  ┊27┊      if (!scope.onBlur) return;
+┊  ┊28┊
+┊  ┊29┊      this.$timeout(() => {
+┊  ┊30┊        scope.onBlur();
+┊  ┊31┊      });
+┊  ┊32┊    });
+┊  ┊33┊
+┊  ┊34┊    element.bind('keydown', (e) => {
+┊  ┊35┊      if (e.which != 13) return;
+┊  ┊36┊
+┊  ┊37┊      if (scope.returnClose) {
+┊  ┊38┊        element[0].blur();
+┊  ┊39┊      }
+┊  ┊40┊
+┊  ┊41┊      if (scope.onReturn) {
+┊  ┊42┊        this.$timeout(() => {
+┊  ┊43┊          scope.onReturn();
+┊  ┊44┊        });
+┊  ┊45┊      }
+┊  ┊46┊    });
+┊  ┊47┊  }
+┊  ┊48┊}
+┊  ┊49┊
+┊  ┊50┊InputDirective.$name = 'input';
+┊  ┊51┊InputDirective.$inject = ['$timeout'];🚫↵
```
[}]: #

[{]: <helper> (diff_step 3.17)
#### Step 3.17: Load input directive

##### Changed client/scripts/lib/app.js
```diff
@@ -12,6 +12,7 @@
 ┊12┊12┊// Modules
 ┊13┊13┊import ChatsCtrl from '../controllers/chats.controller';
 ┊14┊14┊import ChatCtrl from '../controllers/chat.controller';
+┊  ┊15┊import InputDirective from '../directives/input.directive';
 ┊15┊16┊import CalendarFilter from '../filters/calendar.filter';
 ┊16┊17┊import RoutesConfig from '../routes';
 ┊17┊18┊
```
```diff
@@ -27,6 +28,7 @@
 ┊27┊28┊new Loader(App)
 ┊28┊29┊  .load(ChatsCtrl)
 ┊29┊30┊  .load(ChatCtrl)
+┊  ┊31┊  .load(InputDirective)
 ┊30┊32┊  .load(CalendarFilter)
 ┊31┊33┊  .load(RoutesConfig);
```
[}]: #

And now we can use those events in our view:

[{]: <helper> (diff_step 3.18)
#### Step 3.18: Add chat view

##### Changed client/templates/chat.html
```diff
@@ -18,7 +18,10 @@
 ┊18┊18┊    <label class="item-input-wrapper">
 ┊19┊19┊      <input ng-model="chat.message"
 ┊20┊20┊             dir="auto"
-┊21┊  ┊             type="text"/>
+┊  ┊21┊             type="text"
+┊  ┊22┊             on-return="chat.sendMessage(); chat.closeKeyboard()"
+┊  ┊23┊             on-focus="chat.inputUp()"
+┊  ┊24┊             on-blur="chat.inputDown()"/>
 ┊22┊25┊    </label>
 ┊23┊26┊
 ┊24┊27┊    <span ng-if="chat.message.length > 0">
```
[}]: #

And implement the controller methods which handle those events:

[{]: <helper> (diff_step 3.19)
#### Step 3.19: Implement input directive handlers in chat controller

##### Changed client/scripts/controllers/chat.controller.js
```diff
@@ -1,3 +1,5 @@
+┊ ┊1┊import Ionic from 'ionic-scripts';
+┊ ┊2┊import { Meteor } from 'meteor/meteor';
 ┊1┊3┊import { Controller } from 'angular-ecmascript/module-helpers';
 ┊2┊4┊import { Chats, Messages } from '../../../lib/collections';
 ┊3┊5┊
```
```diff
@@ -6,6 +8,8 @@
 ┊ 6┊ 8┊    super(...arguments);
 ┊ 7┊ 9┊
 ┊ 8┊10┊    this.chatId = this.$stateParams.chatId;
+┊  ┊11┊    this.isIOS = Ionic.Platform.isWebView() && Ionic.Platform.isIOS();
+┊  ┊12┊    this.isCordova = Meteor.isCordova;
 ┊ 9┊13┊
 ┊10┊14┊    this.helpers({
 ┊11┊15┊      messages() {
```
```diff
@@ -19,7 +23,35 @@
 ┊19┊23┊
 ┊20┊24┊  sendMessage() {
 ┊21┊25┊  }
+┊  ┊26┊
+┊  ┊27┊  inputUp () {
+┊  ┊28┊    if (this.isIOS) {
+┊  ┊29┊      this.keyboardHeight = 216;
+┊  ┊30┊    }
+┊  ┊31┊
+┊  ┊32┊    this.scrollBottom(true);
+┊  ┊33┊  }
+┊  ┊34┊
+┊  ┊35┊  inputDown () {
+┊  ┊36┊    if (this.isIOS) {
+┊  ┊37┊      this.keyboardHeight = 0;
+┊  ┊38┊    }
+┊  ┊39┊
+┊  ┊40┊    this.$ionicScrollDelegate.$getByHandle('chatScroll').resize();
+┊  ┊41┊  }
+┊  ┊42┊
+┊  ┊43┊  closeKeyboard () {
+┊  ┊44┊    if (this.isCordova) {
+┊  ┊45┊      cordova.plugins.Keyboard.close();
+┊  ┊46┊    }
+┊  ┊47┊  }
+┊  ┊48┊
+┊  ┊49┊  scrollBottom(animate) {
+┊  ┊50┊    this.$timeout(() => {
+┊  ┊51┊      this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
+┊  ┊52┊    }, 300);
+┊  ┊53┊  }
 ┊22┊54┊}
 ┊23┊55┊
 ┊24┊56┊ChatCtrl.$name = 'ChatCtrl';
-┊25┊  ┊ChatCtrl.$inject = ['$stateParams'];🚫↵
+┊  ┊57┊ChatCtrl.$inject = ['$stateParams', '$timeout', '$ionicScrollDelegate'];
```
[}]: #

We will also add some `css` to this view:

[{]: <helper> (diff_step 3.20)
#### Step 3.20: Add footer style to chat stylesheet

##### Changed client/styles/chat.scss
```diff
@@ -45,7 +45,7 @@
 ┊45┊45┊    background-color: #FFF;
 ┊46┊46┊  }
 ┊47┊47┊
-┊48┊  ┊  &.message-other::before, &.message-mine::before, {
+┊  ┊48┊  &.message-other::before, &.message-mine::before {
 ┊49┊49┊    content: "";
 ┊50┊50┊    position: absolute;
 ┊51┊51┊    bottom: 3px;
```
```diff
@@ -83,4 +83,20 @@
 ┊ 83┊ 83┊    color: gray;
 ┊ 84┊ 84┊    font-size: 12px;
 ┊ 85┊ 85┊  }
+┊   ┊ 86┊}
+┊   ┊ 87┊
+┊   ┊ 88┊.footer-chat {
+┊   ┊ 89┊  .item-input-wrapper {
+┊   ┊ 90┊    background-color: #FFF;
+┊   ┊ 91┊  }
+┊   ┊ 92┊
+┊   ┊ 93┊  .button.button-icon {
+┊   ┊ 94┊    margin: 0 10px;
+┊   ┊ 95┊  }
+┊   ┊ 96┊
+┊   ┊ 97┊  .buttons-seperator {
+┊   ┊ 98┊    color: gray;
+┊   ┊ 99┊    font-size: 18px;
+┊   ┊100┊    line-height: 32px;
+┊   ┊101┊  }
 ┊ 86┊102┊}🚫↵
```
[}]: #

So now when the user focuses on the input, it goes up.

So now it's time to implement the `sendMessage()` in our controller.

We will use `callMethod()` in order to call that method on the server side.

[{]: <helper> (diff_step 3.21)
#### Step 3.21: Implement new message method in chat controller

##### Changed client/scripts/controllers/chat.controller.js
```diff
@@ -1,4 +1,5 @@
 ┊1┊1┊import Ionic from 'ionic-scripts';
+┊ ┊2┊import { _ } from 'meteor/underscore';
 ┊2┊3┊import { Meteor } from 'meteor/meteor';
 ┊3┊4┊import { Controller } from 'angular-ecmascript/module-helpers';
 ┊4┊5┊import { Chats, Messages } from '../../../lib/collections';
```
```diff
@@ -22,6 +23,15 @@
 ┊22┊23┊  }
 ┊23┊24┊
 ┊24┊25┊  sendMessage() {
+┊  ┊26┊    if (_.isEmpty(this.message)) return;
+┊  ┊27┊
+┊  ┊28┊    this.callMethod('newMessage', {
+┊  ┊29┊      text: this.message,
+┊  ┊30┊      type: 'text',
+┊  ┊31┊      chatId: this.chatId
+┊  ┊32┊    });
+┊  ┊33┊
+┊  ┊34┊    delete this.message;
 ┊25┊35┊  }
 ┊26┊36┊
 ┊27┊37┊  inputUp () {
```
[}]: #

Now let's create our method in `lib/methods.js`:

[{]: <helper> (diff_step 3.22)
#### Step 3.22: Add new message meteor method

##### Added lib/methods.js
```diff
@@ -0,0 +1,13 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Chats, Messages } from '../lib/collections';
+┊  ┊ 3┊
+┊  ┊ 4┊Meteor.methods({
+┊  ┊ 5┊  newMessage(message) {
+┊  ┊ 6┊    message.timestamp = new Date();
+┊  ┊ 7┊
+┊  ┊ 8┊    const messageId = Messages.insert(message);
+┊  ┊ 9┊    Chats.update(message.chatId, { $set: { lastMessage: message } });
+┊  ┊10┊
+┊  ┊11┊    return messageId;
+┊  ┊12┊  }
+┊  ┊13┊});🚫↵
```
[}]: #

Let's add validation to our method.

`Meteor` provides us with a useful package named `check` that validates data types and scheme.

Add it by running:

    $ meteor add check

And now let's use it in the `newMessage()` method:

[{]: <helper> (diff_step 3.24)
#### Step 3.24: Validate new message method params

##### Changed lib/methods.js
```diff
@@ -3,6 +3,12 @@
 ┊ 3┊ 3┊
 ┊ 4┊ 4┊Meteor.methods({
 ┊ 5┊ 5┊  newMessage(message) {
+┊  ┊ 6┊    check(message, {
+┊  ┊ 7┊      type: String,
+┊  ┊ 8┊      text: String,
+┊  ┊ 9┊      chatId: String
+┊  ┊10┊    });
+┊  ┊11┊
 ┊ 6┊12┊    message.timestamp = new Date();
 ┊ 7┊13┊
 ┊ 8┊14┊    const messageId = Messages.insert(message);
```
[}]: #

Now that it's ready you can go ahead and send a message and view it on the screen.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step2.md) | [Next Step >](step4.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #