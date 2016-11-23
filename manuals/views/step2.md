[{]: <region> (header)
# Step 2: Creating a realtime Meteor server
[}]: #
[{]: <region> (body)
In this step we are going to add several features to our project:

* Create a server and initialize some static data in it.
* Connect the client to the server.

So let’s start by creating some `Mongo` collections which will be used to store our data.

`Mongo` collections need to be available in both client and server in order to share data, so we will declare our collections in a folder named `lib` under the project’s root (`lib/collections.js`).

[{]: <helper> (diff_step 2.1)
#### Step 2.1: Add meteor collections

##### Added lib/collections.js
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊import { Mongo } from 'meteor/mongo';
+┊ ┊2┊
+┊ ┊3┊export const Chats = new Mongo.Collection('chats');
+┊ ┊4┊export const Messages = new Mongo.Collection('messages');🚫↵
```
[}]: #

Now we need to create our server's first file, so let's create a directory named `server` and create the server's startup file named `bootstrap.js` (`server/bootstrap.js`).

This file should be run first because we want to run some initialization code there, so we can use `Meteor.startup()` to define our logic:

[{]: <helper> (diff_step 2.2)
#### Step 2.2: Create server bootstrap

##### Added server/bootstrap.js
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊Meteor.startup(function() {
+┊ ┊2┊
+┊ ┊3┊});🚫↵
```
[}]: #

Our next step is to move the static data to the server, so let’s add it in the `bootstrap.js` file we just created, we also want this code to run only once when there is no data at all inside the collections.

[{]: <helper> (diff_step 2.3)
#### Step 2.3: Add chats collection data stub

##### Changed server/bootstrap.js
```diff
@@ -1,3 +1,66 @@
+┊  ┊ 1┊import Moment from 'moment';
+┊  ┊ 2┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 3┊import { Chats, Messages } from '../lib/collections';
+┊  ┊ 4┊
 ┊ 1┊ 5┊Meteor.startup(function() {
+┊  ┊ 6┊  if (Chats.find().count() !== 0) return;
+┊  ┊ 7┊
+┊  ┊ 8┊  Messages.remove({});
+┊  ┊ 9┊
+┊  ┊10┊  const messages = [
+┊  ┊11┊    {
+┊  ┊12┊      text: 'You on your way?',
+┊  ┊13┊      timestamp: Moment().subtract(1, 'hours').toDate()
+┊  ┊14┊    },
+┊  ┊15┊    {
+┊  ┊16┊      text: 'Hey, it\'s me',
+┊  ┊17┊      timestamp: Moment().subtract(2, 'hours').toDate()
+┊  ┊18┊    },
+┊  ┊19┊    {
+┊  ┊20┊      text: 'I should buy a boat',
+┊  ┊21┊      timestamp: Moment().subtract(1, 'days').toDate()
+┊  ┊22┊    },
+┊  ┊23┊    {
+┊  ┊24┊      text: 'Look at my mukluks!',
+┊  ┊25┊      timestamp: Moment().subtract(4, 'days').toDate()
+┊  ┊26┊    },
+┊  ┊27┊    {
+┊  ┊28┊      text: 'This is wicked good ice cream.',
+┊  ┊29┊      timestamp: Moment().subtract(2, 'weeks').toDate()
+┊  ┊30┊    }
+┊  ┊31┊  ];
+┊  ┊32┊
+┊  ┊33┊  messages.forEach((m) => {
+┊  ┊34┊    Messages.insert(m);
+┊  ┊35┊  });
+┊  ┊36┊
+┊  ┊37┊  const chats = [
+┊  ┊38┊    {
+┊  ┊39┊      name: 'Ethan Gonzalez',
+┊  ┊40┊      picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
+┊  ┊41┊    },
+┊  ┊42┊    {
+┊  ┊43┊      name: 'Bryan Wallace',
+┊  ┊44┊      picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
+┊  ┊45┊    },
+┊  ┊46┊    {
+┊  ┊47┊      name: 'Avery Stewart',
+┊  ┊48┊      picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
+┊  ┊49┊    },
+┊  ┊50┊    {
+┊  ┊51┊      name: 'Katie Peterson',
+┊  ┊52┊      picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
+┊  ┊53┊    },
+┊  ┊54┊    {
+┊  ┊55┊      name: 'Ray Edwards',
+┊  ┊56┊      picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
+┊  ┊57┊    }
+┊  ┊58┊  ];
 ┊ 2┊59┊
+┊  ┊60┊  chats.forEach((chat) => {
+┊  ┊61┊    const message = Messages.findOne({ chatId: { $exists: false } });
+┊  ┊62┊    chat.lastMessage = message;
+┊  ┊63┊    const chatId = Chats.insert(chat);
+┊  ┊64┊    Messages.update(message._id, { $set: { chatId } });
+┊  ┊65┊  });
 ┊ 3┊66┊});🚫↵
```
[}]: #

Now we need to remove the static data from the client and get it from the server.

So let's use `angular-meteor`'s API for this. We will define a helper named `data`, and we will return the `Mongo` collection cursor.

[{]: <helper> (diff_step 2.4)
#### Step 2.4: Add chats collection helper to chats controller

##### Changed client/scripts/controllers/chats.controller.js
```diff
@@ -1,57 +1,15 @@
-┊ 1┊  ┊import Moment from 'moment';
 ┊ 2┊ 1┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 2┊import { Chats } from '../../../lib/collections';
 ┊ 3┊ 3┊
 ┊ 4┊ 4┊export default class ChatsCtrl extends Controller {
 ┊ 5┊ 5┊  constructor() {
 ┊ 6┊ 6┊    super(...arguments);
 ┊ 7┊ 7┊
-┊ 8┊  ┊    this.data = [
-┊ 9┊  ┊      {
-┊10┊  ┊        _id: 0,
-┊11┊  ┊        name: 'Ethan Gonzalez',
-┊12┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
-┊13┊  ┊        lastMessage: {
-┊14┊  ┊          text: 'You on your way?',
-┊15┊  ┊          timestamp: Moment().subtract(1, 'hours').toDate()
-┊16┊  ┊        }
-┊17┊  ┊      },
-┊18┊  ┊      {
-┊19┊  ┊        _id: 1,
-┊20┊  ┊        name: 'Bryan Wallace',
-┊21┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
-┊22┊  ┊        lastMessage: {
-┊23┊  ┊          text: 'Hey, it\'s me',
-┊24┊  ┊          timestamp: Moment().subtract(2, 'hours').toDate()
-┊25┊  ┊        }
-┊26┊  ┊      },
-┊27┊  ┊      {
-┊28┊  ┊        _id: 2,
-┊29┊  ┊        name: 'Avery Stewart',
-┊30┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
-┊31┊  ┊        lastMessage: {
-┊32┊  ┊          text: 'I should buy a boat',
-┊33┊  ┊          timestamp: Moment().subtract(1, 'days').toDate()
-┊34┊  ┊        }
-┊35┊  ┊      },
-┊36┊  ┊      {
-┊37┊  ┊        _id: 3,
-┊38┊  ┊        name: 'Katie Peterson',
-┊39┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
-┊40┊  ┊        lastMessage: {
-┊41┊  ┊          text: 'Look at my mukluks!',
-┊42┊  ┊          timestamp: Moment().subtract(4, 'days').toDate()
-┊43┊  ┊        }
-┊44┊  ┊      },
-┊45┊  ┊      {
-┊46┊  ┊        _id: 4,
-┊47┊  ┊        name: 'Ray Edwards',
-┊48┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
-┊49┊  ┊        lastMessage: {
-┊50┊  ┊          text: 'This is wicked good ice cream.',
-┊51┊  ┊          timestamp: Moment().subtract(2, 'weeks').toDate()
-┊52┊  ┊        }
+┊  ┊ 8┊    this.helpers({
+┊  ┊ 9┊      data() {
+┊  ┊10┊        return Chats.find();
 ┊53┊11┊      }
-┊54┊  ┊    ];
+┊  ┊12┊    });
 ┊55┊13┊  }
 ┊56┊14┊
 ┊57┊15┊  remove(chat) {
```
[}]: #

Now that the data comes from the server, we need to modify the `remove()` method in order to use `Mongo` Collection API that removes the object from both client and server:

[{]: <helper> (diff_step 2.5)
#### Step 2.5: Update delete button logic to use controller helper

##### Changed client/scripts/controllers/chats.controller.js
```diff
@@ -13,7 +13,7 @@
 ┊13┊13┊  }
 ┊14┊14┊
 ┊15┊15┊  remove(chat) {
-┊16┊  ┊    this.data.splice(this.data.indexOf(chat), 1);
+┊  ┊16┊    Chats.remove(chat._id);
 ┊17┊17┊  }
 ┊18┊18┊}
```
[}]: #

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step1.md) | [Next Step >](step3.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #