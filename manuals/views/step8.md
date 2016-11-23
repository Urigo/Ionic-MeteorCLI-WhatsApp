[{]: <region> (header)
# Step 8: Send image messages
[}]: #
[{]: <region> (body)
Our last step would be implementing image messages support. We will use the same package from the previous step to achieve that.

So we will use the same logic of taking the picture in the controller, and call the same `newMessage()` server method:

[{]: <helper> (diff_step 8.1)
#### Step 8.1: Add send picture logic

##### Changed client/scripts/controllers/chat.controller.js
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import Ionic from 'ionic-scripts';
 ┊2┊2┊import { _ } from 'meteor/underscore';
 ┊3┊3┊import { Meteor } from 'meteor/meteor';
+┊ ┊4┊import { MeteorCameraUI } from 'meteor/okland:camera-ui';
 ┊4┊5┊import { Controller } from 'angular-ecmascript/module-helpers';
 ┊5┊6┊import { Chats, Messages } from '../../../lib/collections';
 ┊6┊7┊
```
```diff
@@ -24,6 +25,18 @@
 ┊24┊25┊    this.autoScroll();
 ┊25┊26┊  }
 ┊26┊27┊
+┊  ┊28┊  sendPicture() {
+┊  ┊29┊    MeteorCameraUI.getPicture({}, (err, data) => {
+┊  ┊30┊      if (err) return this.handleError(err);
+┊  ┊31┊
+┊  ┊32┊      this.callMethod('newMessage', {
+┊  ┊33┊        picture: data,
+┊  ┊34┊        type: 'picture',
+┊  ┊35┊        chatId: this.chatId
+┊  ┊36┊      });
+┊  ┊37┊    });
+┊  ┊38┊  }
+┊  ┊39┊
 ┊27┊40┊  sendMessage() {
 ┊28┊41┊    if (_.isEmpty(this.message)) return;
 ┊29┊42┊
```
```diff
@@ -74,7 +87,18 @@
 ┊ 74┊ 87┊      this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
 ┊ 75┊ 88┊    }, 300);
 ┊ 76┊ 89┊  }
+┊   ┊ 90┊
+┊   ┊ 91┊  handleError(err) {
+┊   ┊ 92┊    if (err.error == 'cancel') return;
+┊   ┊ 93┊    this.$log.error('Profile save error ', err);
+┊   ┊ 94┊
+┊   ┊ 95┊    this.$ionicPopup.alert({
+┊   ┊ 96┊      title: err.reason || 'Save failed',
+┊   ┊ 97┊      template: 'Please try again',
+┊   ┊ 98┊      okType: 'button-positive button-clear'
+┊   ┊ 99┊    });
+┊   ┊100┊  }
 ┊ 77┊101┊}
 ┊ 78┊102┊
 ┊ 79┊103┊ChatCtrl.$name = 'ChatCtrl';
-┊ 80┊   ┊ChatCtrl.$inject = ['$stateParams', '$timeout', '$ionicScrollDelegate'];
+┊   ┊104┊ChatCtrl.$inject = ['$stateParams', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$log'];
```
[}]: #

And now we need to register an `ng-click` event to the image button on the view:

[{]: <helper> (diff_step 8.2)
#### Step 8.2: Invoke send picture logic on click

##### Changed client/templates/chat.html
```diff
@@ -28,7 +28,7 @@
 ┊28┊28┊      <button ng-click="chat.sendMessage()" class="button button-clear button-positive">Send</button>
 ┊29┊29┊    </span>
 ┊30┊30┊    <span ng-if="!chat.message || chat.message.length === 0">
-┊31┊  ┊      <button class="button button-clear button-icon button-positive icon ion-ios-camera-outline"></button>
+┊  ┊31┊      <button ng-click="chat.sendPicture()" class="button button-clear button-icon button-positive icon ion-ios-camera-outline"></button>
 ┊32┊32┊      <i class="buttons-seperator icon ion-android-more-vertical"></i>
 ┊33┊33┊      <button class="button button-clear button-icon button-positive icon ion-ios-mic-outline"></button>
 ┊34┊34┊    </span>
```
[}]: #

In the server, we need to add a validation scheme for image messages in the `newMessage()` method:

[{]: <helper> (diff_step 8.3)
#### Step 8.3: Add picture message validation

##### Changed lib/methods.js
```diff
@@ -1,4 +1,5 @@
 ┊1┊1┊import { Meteor } from 'meteor/meteor';
+┊ ┊2┊import { check } from 'meteor/check';
 ┊2┊3┊import { Chats, Messages } from '../lib/collections';
 ┊3┊4┊
 ┊4┊5┊Meteor.methods({
```
```diff
@@ -8,11 +9,18 @@
 ┊ 8┊ 9┊        'Must be logged in to send message.');
 ┊ 9┊10┊    }
 ┊10┊11┊
-┊11┊  ┊    check(message, {
-┊12┊  ┊      type: String,
-┊13┊  ┊      text: String,
-┊14┊  ┊      chatId: String
-┊15┊  ┊    });
+┊  ┊12┊    check(message, Match.OneOf(
+┊  ┊13┊      {
+┊  ┊14┊        text: String,
+┊  ┊15┊        type: String,
+┊  ┊16┊        chatId: String
+┊  ┊17┊      },
+┊  ┊18┊      {
+┊  ┊19┊        picture: String,
+┊  ┊20┊        type: String,
+┊  ┊21┊        chatId: String
+┊  ┊22┊      }
+┊  ┊23┊    ));
 ┊16┊24┊
 ┊17┊25┊    message.timestamp = new Date();
 ┊18┊26┊    message.userId = this.userId;
```
[}]: #

Our next step would be updating the chat view to support image messages:

[{]: <helper> (diff_step 8.4)
#### Step 8.4: Add picture message type to chat view

##### Changed client/templates/chat.html
```diff
@@ -6,7 +6,12 @@
 ┊ 6┊ 6┊    <div class="message-list">
 ┊ 7┊ 7┊      <div ng-repeat="message in chat.messages" class="message-wrapper">
 ┊ 8┊ 8┊        <div class="message" ng-class="message.userId === $root.currentUser._id ? 'message-mine' : 'message-other'">
-┊ 9┊  ┊          <div class="message-text">{{ message.text }}</div>
+┊  ┊ 9┊          <ng-switch on="message.type">
+┊  ┊10┊            <div ng-switch-when="text" class="text">{{ message.text }}</div>
+┊  ┊11┊            <div ng-switch-when="picture" class="picture">
+┊  ┊12┊              <img ng-src="{{ message.picture }}">
+┊  ┊13┊            </div>
+┊  ┊14┊          </ng-switch>
 ┊10┊15┊          <span class="message-timestamp">{{ message.timestamp | amDateFormat: 'HH:mm' }}</span>
 ┊11┊16┊        </div>
 ┊12┊17┊      </div>
```
[}]: #

Let's add some `css` to prevent images from looking silly:

[{]: <helper> (diff_step 8.5)
#### Step 8.5: Add picture style to chat stylesheet

##### Changed client/styles/chat.scss
```diff
@@ -66,7 +66,7 @@
 ┊66┊66┊    background-image: url(/message-mine.png)
 ┊67┊67┊  }
 ┊68┊68┊
-┊69┊  ┊  .message-text {
+┊  ┊69┊  .text {
 ┊70┊70┊    padding: 5px 7px;
 ┊71┊71┊    word-wrap: break-word;
 ┊72┊72┊
```
```diff
@@ -76,6 +76,16 @@
 ┊76┊76┊    }
 ┊77┊77┊  }
 ┊78┊78┊
+┊  ┊79┊  .picture {
+┊  ┊80┊    padding: 4px 4px 0;
+┊  ┊81┊
+┊  ┊82┊    img {
+┊  ┊83┊      width: 220px;
+┊  ┊84┊      height: 130px;
+┊  ┊85┊      border-radius: 6px;
+┊  ┊86┊    }
+┊  ┊87┊  }
+┊  ┊88┊
 ┊79┊89┊  .message-timestamp {
 ┊80┊90┊    position: absolute;
 ┊81┊91┊    bottom: 2px;
```
[}]: #

We also want to add image icon on the chats list in case when the last message is an image message, so let's add it:

[{]: <helper> (diff_step 8.6)
#### Step 8.6: Add picture message indication in chats view

##### Changed client/templates/chats.html
```diff
@@ -11,7 +11,10 @@
 ┊11┊11┊                href="#/tab/chats/{{ chat._id }}">
 ┊12┊12┊        <img ng-src="{{ chat | chatPicture }}">
 ┊13┊13┊        <h2>{{ chat | chatName }}</h2>
-┊14┊  ┊        <p>{{ chat.lastMessage.text }}</p>
+┊  ┊14┊        <ng-switch on="chat.lastMessage.type">
+┊  ┊15┊          <p ng-switch-when="text">{{ chat.lastMessage.text }}</p>
+┊  ┊16┊          <p ng-switch-when="picture">image</p>
+┊  ┊17┊        </ng-switch>
 ┊15┊18┊        <span class="last-message-timestamp">{{ chat.lastMessage.timestamp | calendar }}</span>
 ┊16┊19┊        <i class="icon ion-chevron-right icon-accessory"></i>
 ┊17┊20┊        <ion-option-button class="button-assertive" ng-click="chats.remove(chat)">
```
[}]: #

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step7.md) | [Next Step >](step9.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #