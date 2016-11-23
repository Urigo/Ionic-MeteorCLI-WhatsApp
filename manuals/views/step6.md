[{]: <region> (header)
# Step 6: Privacy
[}]: #
[{]: <region> (body)
Right now all the chats are published to all the clients which is not very safe for privacy. Let's fix that.

First thing we need to do in order to stop all the automatic publication of information is to remove the `autopublish` package from the Meteor server. Type in the command line:

    $ meteor remove autopublish

We will add now the [publish-composite](https://atmospherejs.com/reywood/publish-composite) package, which we will use later.

    $ meteor add reywood:publish-composite

Now we need to explicitly define our publications. Let's start by sending the users' information.

Create a file named `publications.js` under the `server` folder and define the query we want to send to our clients:

[{]: <helper> (diff_step 6.3)
#### Step 6.3: Add users publication

##### Added server/publications.js
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊import { Meteor } from 'meteor/meteor';
+┊ ┊2┊
+┊ ┊3┊Meteor.publish('users', function() {
+┊ ┊4┊  return Meteor.users.find({}, { fields: { profile: 1 } });
+┊ ┊5┊});🚫↵
```
[}]: #

And of course we need to modify some of the client side code, we need to make sure that the client is subscribed to the published data, so let's do so in `NewChatCtrl`, because this is where we need the `users` data:

[{]: <helper> (diff_step 6.4)
#### Step 6.4: Add users subscription

##### Changed client/scripts/controllers/new-chat.controller.js
```diff
@@ -6,6 +6,8 @@
 ┊ 6┊ 6┊  constructor() {
 ┊ 7┊ 7┊    super(...arguments);
 ┊ 8┊ 8┊
+┊  ┊ 9┊    this.subscribe('users');
+┊  ┊10┊
 ┊ 9┊11┊    this.helpers({
 ┊10┊12┊      users() {
 ┊11┊13┊        return Meteor.users.find({ _id: { $ne: this.currentUserId } });
```
[}]: #

Now let's do a more complex publication, let's send each client only his chats with their messages.

In order to do that, we need to do a joined collections publication. `reywood:publish-composite` package helps us achieve it with a very easy and convenient way.

[{]: <helper> (diff_step 6.5)
#### Step 6.5: Add chats publication

##### Changed server/publications.js
```diff
@@ -1,5 +1,31 @@
 ┊ 1┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Chats, Messages } from '../lib/collections';
 ┊ 2┊ 3┊
 ┊ 3┊ 4┊Meteor.publish('users', function() {
 ┊ 4┊ 5┊  return Meteor.users.find({}, { fields: { profile: 1 } });
+┊  ┊ 6┊});
+┊  ┊ 7┊
+┊  ┊ 8┊Meteor.publishComposite('chats', function() {
+┊  ┊ 9┊  if (!this.userId) return;
+┊  ┊10┊
+┊  ┊11┊  return {
+┊  ┊12┊    find() {
+┊  ┊13┊      return Chats.find({ userIds: this.userId });
+┊  ┊14┊    },
+┊  ┊15┊    children: [
+┊  ┊16┊      {
+┊  ┊17┊        find(chat) {
+┊  ┊18┊          return Messages.find({ chatId: chat._id });
+┊  ┊19┊        }
+┊  ┊20┊      },
+┊  ┊21┊      {
+┊  ┊22┊        find(chat) {
+┊  ┊23┊          const query = { _id: { $in: chat.userIds } };
+┊  ┊24┊          const options = { fields: { profile: 1 } };
+┊  ┊25┊
+┊  ┊26┊          return Meteor.users.find(query, options);
+┊  ┊27┊        }
+┊  ┊28┊      }
+┊  ┊29┊    ]
+┊  ┊30┊  };
 ┊ 5┊31┊});🚫↵
```
[}]: #

Now we will add a subscription to the `chats` data in the client:

[{]: <helper> (diff_step 6.6)
#### Step 6.6: Add chats subscription

##### Changed client/scripts/routes.js
```diff
@@ -1,4 +1,5 @@
 ┊1┊1┊import { _ } from 'meteor/underscore';
+┊ ┊2┊import { Meteor } from 'meteor/meteor';
 ┊2┊3┊import { Config, Runner } from 'angular-ecmascript/module-helpers';
 ┊3┊4┊
 ┊4┊5┊import chatsTemplateUrl from '../templates/chats.html';
```
```diff
@@ -23,7 +24,10 @@
 ┊23┊24┊        abstract: true,
 ┊24┊25┊        templateUrl: tabsTemplateUrl,
 ┊25┊26┊        resolve: {
-┊26┊  ┊          user: this.isAuthorized
+┊  ┊27┊          user: this.isAuthorized,
+┊  ┊28┊          chats() {
+┊  ┊29┊            return Meteor.subscribe('chats');
+┊  ┊30┊          }
 ┊27┊31┊        }
 ┊28┊32┊      })
 ┊29┊33┊      .state('tab.chats', {
```
[}]: #

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step5.md) | [Next Step >](step7.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #