[{]: <region> (header)
# Step 1: Layout, coding style & structure
[}]: #
[{]: <region> (body)
We will start by creating the project’s folder structure, `Meteor` has a special behavior for certain folders:

* client - These files will be available only in the client side.
* server - These files will be available only in the server side.
* public - These files will be served as is to the client e.g. assets like images, fonts, etc.
* lib - Any folder named lib (in any hierarchy) will be loaded first.
* Any other folder name will be included in both client and server and will be used for code-sharing.

So this will be our folder structure to the project:

* client (client side with `AngularJS` and `Ionic` code)
    * scripts
    * templates
    * styles
    * index.html
* server (server side code only)
* public (assets, images)
* lib (define methods and collections in order to make them available in both client and server)

So let’s start by creating our first file, the `index.html` which will be placed under the `client` folder:

[{]: <helper> (diff_step 1.1)
#### Step 1.1: Create main html file

##### Added client/index.html
```diff
@@ -0,0 +1,22 @@
+┊  ┊ 1┊<head>
+┊  ┊ 2┊  <meta charset="utf-8">
+┊  ┊ 3┊  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
+┊  ┊ 4┊  <title>Whatsapp Meteor</title>
+┊  ┊ 5┊</head>
+┊  ┊ 6┊
+┊  ┊ 7┊<body>
+┊  ┊ 8┊<!--
+┊  ┊ 9┊  The nav bar that will be updated as we navigate between views.
+┊  ┊10┊-->
+┊  ┊11┊<ion-nav-bar class="bar-stable">
+┊  ┊12┊  <ion-nav-back-button>
+┊  ┊13┊  </ion-nav-back-button>
+┊  ┊14┊</ion-nav-bar>
+┊  ┊15┊<!--
+┊  ┊16┊  The views will be rendered in the <ion-nav-view> directive below
+┊  ┊17┊  Templates are in the /templates folder (but you could also
+┊  ┊18┊  have templates inline in this html file if you'd like).
+┊  ┊19┊-->
+┊  ┊20┊<ion-nav-view></ion-nav-view>
+┊  ┊21┊
+┊  ┊22┊</body>🚫↵
```
[}]: #

We used some ionic tags to achieve mobile style:

* ion-nav-bar - Create a navigation bar in the page header.
* ion-nav-view - This is a placeholder to the real content. `AngularJS` and `Ionic` will put your content inside this tag automatically.

Note that we only provide the `<head>` and `<body>` tags because `Meteor` takes care of appending the relevant html parts into one file, and any tag we will use here will be added to `Meteor`'s main index.html file.

This feature is really useful because we do not need to take care of including our files in `index.html` since it will be maintained automatically.

Our next step is to create the `AngularJS` module and bootstrap it according to our platform.
We will create a new file called `app.js`.

This bootstrap file should be loaded first, because any other `AngularJS` code will depend on this module, so we need to put this file inside a folder called `lib`, so we will create a file in this path: `client/scripts/lib/app.js`.

In this file we will initialize all the modules we need and load our module-helpers, so any time we create a module-helper it should be loaded here right after.

We will also check for the current platform (browser or mobile) and initialize the module according to the result:

[{]: <helper> (diff_step 1.2)
#### Step 1.2: Create main app file

##### Added client/scripts/lib/app.js
```diff
@@ -0,0 +1,30 @@
+┊  ┊ 1┊// Libs
+┊  ┊ 2┊import 'angular-animate';
+┊  ┊ 3┊import 'angular-meteor';
+┊  ┊ 4┊import 'angular-sanitize';
+┊  ┊ 5┊import 'angular-ui-router';
+┊  ┊ 6┊import 'ionic-scripts';
+┊  ┊ 7┊import Angular from 'angular';
+┊  ┊ 8┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 9┊
+┊  ┊10┊// Modules
+┊  ┊11┊
+┊  ┊12┊const App = 'Whatsapp';
+┊  ┊13┊
+┊  ┊14┊// App
+┊  ┊15┊Angular.module(App, [
+┊  ┊16┊  'angular-meteor',
+┊  ┊17┊  'ionic'
+┊  ┊18┊]);
+┊  ┊19┊
+┊  ┊20┊// Startup
+┊  ┊21┊if (Meteor.isCordova) {
+┊  ┊22┊  Angular.element(document).on('deviceready', onReady);
+┊  ┊23┊}
+┊  ┊24┊else {
+┊  ┊25┊  Angular.element(document).ready(onReady);
+┊  ┊26┊}
+┊  ┊27┊
+┊  ┊28┊function onReady() {
+┊  ┊29┊  Angular.bootstrap(document, [App]);
+┊  ┊30┊}
```
[}]: #

Before we dive into building our app's different components, we need a way to write them using `es6`'s new class system. For this purpose we will use [angular-ecmascript](https://github.com/DAB0mB/angular-ecmascript) npm package. Let's install it:

    $ meteor npm install angular-ecmascript --save

`angular-ecmascript` is a utility library which will help us write an `AngularJS` app using es6's class system.
As for now there is no official way to do so, however using es6 syntax is recommended, hence `angular-ecmascript` was created.

In addition, `angular-ecmascript` provides us with some very handy features, like auto-injection without using any pre-processors like [ng-annotate](https://github.com/olov/ng-annotate), or setting our controller as the view model any time it is created (See [reference](/api/1.3.11/reactive)). The API shouldn't be too complicated to understand, and we will get familiar with it as we make progress with this tutorial.

Our next step is to create the states and routes for the views.

Our app uses `Ionic` to create 5 tabs: `favorites`, `recents`, ` contacts`, `chats`, and `settings`.

We will define our routes and states with [angular-ui-router](https://atmospherejs.com/angularui/angular-ui-router) (which is included by `Ionic`), and at the moment we will add the main page which is the chats tab:

[{]: <helper> (diff_step 1.4)
#### Step 1.4: Add initial routes

##### Added client/scripts/routes.js
```diff
@@ -0,0 +1,27 @@
+┊  ┊ 1┊import { Config } from 'angular-ecmascript/module-helpers';
+┊  ┊ 2┊
+┊  ┊ 3┊import chatsTemplateUrl from '../templates/chats.html';
+┊  ┊ 4┊import tabsTemplateUrl from '../templates/tabs.html';
+┊  ┊ 5┊
+┊  ┊ 6┊export default class RoutesConfig extends Config {
+┊  ┊ 7┊  configure() {
+┊  ┊ 8┊    this.$stateProvider
+┊  ┊ 9┊      .state('tab', {
+┊  ┊10┊        url: '/tab',
+┊  ┊11┊        abstract: true,
+┊  ┊12┊        templateUrl: tabsTemplateUrl
+┊  ┊13┊      })
+┊  ┊14┊      .state('tab.chats', {
+┊  ┊15┊        url: '/chats',
+┊  ┊16┊        views: {
+┊  ┊17┊          'tab-chats': {
+┊  ┊18┊            templateUrl: chatsTemplateUrl
+┊  ┊19┊          }
+┊  ┊20┊        }
+┊  ┊21┊      });
+┊  ┊22┊
+┊  ┊23┊    this.$urlRouterProvider.otherwise('tab/chats');
+┊  ┊24┊  }
+┊  ┊25┊}
+┊  ┊26┊
+┊  ┊27┊RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];🚫↵
```
[}]: #

[{]: <helper> (diff_step 1.5)
#### Step 1.5: Load routes config

##### Changed client/scripts/lib/app.js
```diff
@@ -5,9 +5,11 @@
 ┊ 5┊ 5┊import 'angular-ui-router';
 ┊ 6┊ 6┊import 'ionic-scripts';
 ┊ 7┊ 7┊import Angular from 'angular';
+┊  ┊ 8┊import Loader from 'angular-ecmascript/module-loader';
 ┊ 8┊ 9┊import { Meteor } from 'meteor/meteor';
 ┊ 9┊10┊
 ┊10┊11┊// Modules
+┊  ┊12┊import RoutesConfig from '../routes';
 ┊11┊13┊
 ┊12┊14┊const App = 'Whatsapp';
 ┊13┊15┊
```
```diff
@@ -17,6 +19,9 @@
 ┊17┊19┊  'ionic'
 ┊18┊20┊]);
 ┊19┊21┊
+┊  ┊22┊new Loader(App)
+┊  ┊23┊  .load(RoutesConfig);
+┊  ┊24┊
 ┊20┊25┊// Startup
 ┊21┊26┊if (Meteor.isCordova) {
 ┊22┊27┊  Angular.element(document).on('deviceready', onReady);
```
[}]: #

And this is the HTML template for the footer that includes our tabs:

[{]: <helper> (diff_step 1.6)
#### Step 1.6: Create tabs view

##### Added client/templates/tabs.html
```diff
@@ -0,0 +1,23 @@
+┊  ┊ 1┊<ion-tabs class="tabs-stable tabs-icon-top tabs-color-positive" ng-cloak>
+┊  ┊ 2┊
+┊  ┊ 3┊  <ion-tab title="Favorites" icon-on="ion-ios-star" icon-off="ion-ios-star-outline" href="#/tab/favorites">
+┊  ┊ 4┊    <ion-nav-view name="tab-favorites"></ion-nav-view>
+┊  ┊ 5┊  </ion-tab>
+┊  ┊ 6┊
+┊  ┊ 7┊  <ion-tab title="Recents" icon-on="ion-ios-clock" icon-off="ion-ios-clock-outline" href="#/tab/recents">
+┊  ┊ 8┊    <ion-nav-view name="tab-recents"></ion-nav-view>
+┊  ┊ 9┊  </ion-tab>
+┊  ┊10┊
+┊  ┊11┊  <ion-tab title="Contacts" icon-on="ion-ios-person" icon-off="ion-ios-person-outline" href="#/tab/contacts">
+┊  ┊12┊    <ion-nav-view name="tab-contacts"></ion-nav-view>
+┊  ┊13┊  </ion-tab>
+┊  ┊14┊
+┊  ┊15┊  <ion-tab title="Chats" icon-on="ion-ios-chatbubble" icon-off="ion-ios-chatbubble-outline" href="#/tab/chats">
+┊  ┊16┊    <ion-nav-view name="tab-chats"></ion-nav-view>
+┊  ┊17┊  </ion-tab>
+┊  ┊18┊
+┊  ┊19┊  <ion-tab title="Settings" icon-on="ion-ios-cog" icon-off="ion-ios-cog-outline" href="#/tab/settings">
+┊  ┊20┊    <ion-nav-view name="tab-settings"></ion-nav-view>
+┊  ┊21┊  </ion-tab>
+┊  ┊22┊
+┊  ┊23┊</ion-tabs>🚫↵
```
[}]: #

Let's create the stub for our default tab - the chats tab:

[{]: <helper> (diff_step 1.7)
#### Step 1.7: Create chats view

##### Added client/templates/chats.html
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊<ion-view view-title="Chats">
+┊ ┊2┊  <ion-content>
+┊ ┊3┊
+┊ ┊4┊  </ion-content>
+┊ ┊5┊</ion-view>🚫↵
```
[}]: #

Our next step will go through creating basic views with some static data using `Ionic` and css pre-processor called [sass](http://sass-lang.com/).

Let’s create an `AngularJS` controller that we will connect to the chats view later on, and we will call it `ChatsCtrl`:

[{]: <helper> (diff_step 1.9)
#### Step 1.9: Create chats controller

##### Added client/scripts/controllers/chats.controller.js
```diff
@@ -0,0 +1,6 @@
+┊ ┊1┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊ ┊2┊
+┊ ┊3┊export default class ChatsCtrl extends Controller {
+┊ ┊4┊}
+┊ ┊5┊
+┊ ┊6┊ChatsCtrl.$name = 'ChatsCtrl';🚫↵
```
[}]: #

[{]: <helper> (diff_step 1.10)
#### Step 1.10: Load chats controller

##### Changed client/scripts/lib/app.js
```diff
@@ -9,6 +9,7 @@
 ┊ 9┊ 9┊import { Meteor } from 'meteor/meteor';
 ┊10┊10┊
 ┊11┊11┊// Modules
+┊  ┊12┊import ChatsCtrl from '../controllers/chats.controller';
 ┊12┊13┊import RoutesConfig from '../routes';
 ┊13┊14┊
 ┊14┊15┊const App = 'Whatsapp';
```
```diff
@@ -20,6 +21,7 @@
 ┊20┊21┊]);
 ┊21┊22┊
 ┊22┊23┊new Loader(App)
+┊  ┊24┊  .load(ChatsCtrl)
 ┊23┊25┊  .load(RoutesConfig);
 ┊24┊26┊
 ┊25┊27┊// Startup
```
[}]: #

From now on we will use our controller as the view model using the `controllerAs` syntax, which basically means that instead of defining data models on the `$scope` we will define them on the controller itself using the `this` argument. For more information, see `AngularJS`'s docs about [ngController](https://docs.angularjs.org/api/ng/directive/ngController).

Now we want to add some static data to this controller, we will use `moment` package to easily create time object, so let’s add it to the project using this command:

    $ meteor npm install moment --save

The `moment` package will be added to `package.json` by `npm`:

[{]: <helper> (diff_step 1.11)
#### Step 1.11: Add moment npm package

##### Changed package.json
```diff
@@ -12,6 +12,7 @@
 ┊12┊12┊    "angular-sanitize": "^1.5.8",
 ┊13┊13┊    "angular-ui-router": "^0.3.2",
 ┊14┊14┊    "ionic-scripts": "^1.3.5",
-┊15┊  ┊    "meteor-node-stubs": "~0.2.0"
+┊  ┊15┊    "meteor-node-stubs": "~0.2.0",
+┊  ┊16┊    "moment": "^2.12.0"
 ┊16┊17┊  }
 ┊17┊18┊}
```
[}]: #

Now let’s add the static data to the `ChatsCtrl`. We will create a stub schema for chats and messages:

[{]: <helper> (diff_step 1.12)
#### Step 1.12: Add data stub to chats controller

##### Changed client/scripts/controllers/chats.controller.js
```diff
@@ -1,6 +1,58 @@
+┊  ┊ 1┊import Moment from 'moment';
 ┊ 1┊ 2┊import { Controller } from 'angular-ecmascript/module-helpers';
 ┊ 2┊ 3┊
 ┊ 3┊ 4┊export default class ChatsCtrl extends Controller {
+┊  ┊ 5┊  constructor() {
+┊  ┊ 6┊    super(...arguments);
+┊  ┊ 7┊
+┊  ┊ 8┊    this.data = [
+┊  ┊ 9┊      {
+┊  ┊10┊        _id: 0,
+┊  ┊11┊        name: 'Ethan Gonzalez',
+┊  ┊12┊        picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
+┊  ┊13┊        lastMessage: {
+┊  ┊14┊          text: 'You on your way?',
+┊  ┊15┊          timestamp: Moment().subtract(1, 'hours').toDate()
+┊  ┊16┊        }
+┊  ┊17┊      },
+┊  ┊18┊      {
+┊  ┊19┊        _id: 1,
+┊  ┊20┊        name: 'Bryan Wallace',
+┊  ┊21┊        picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
+┊  ┊22┊        lastMessage: {
+┊  ┊23┊          text: 'Hey, it\'s me',
+┊  ┊24┊          timestamp: Moment().subtract(2, 'hours').toDate()
+┊  ┊25┊        }
+┊  ┊26┊      },
+┊  ┊27┊      {
+┊  ┊28┊        _id: 2,
+┊  ┊29┊        name: 'Avery Stewart',
+┊  ┊30┊        picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
+┊  ┊31┊        lastMessage: {
+┊  ┊32┊          text: 'I should buy a boat',
+┊  ┊33┊          timestamp: Moment().subtract(1, 'days').toDate()
+┊  ┊34┊        }
+┊  ┊35┊      },
+┊  ┊36┊      {
+┊  ┊37┊        _id: 3,
+┊  ┊38┊        name: 'Katie Peterson',
+┊  ┊39┊        picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
+┊  ┊40┊        lastMessage: {
+┊  ┊41┊          text: 'Look at my mukluks!',
+┊  ┊42┊          timestamp: Moment().subtract(4, 'days').toDate()
+┊  ┊43┊        }
+┊  ┊44┊      },
+┊  ┊45┊      {
+┊  ┊46┊        _id: 4,
+┊  ┊47┊        name: 'Ray Edwards',
+┊  ┊48┊        picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
+┊  ┊49┊        lastMessage: {
+┊  ┊50┊          text: 'This is wicked good ice cream.',
+┊  ┊51┊          timestamp: Moment().subtract(2, 'weeks').toDate()
+┊  ┊52┊        }
+┊  ┊53┊      }
+┊  ┊54┊    ];
+┊  ┊55┊  }
 ┊ 4┊56┊}
 ┊ 5┊57┊
 ┊ 6┊58┊ChatsCtrl.$name = 'ChatsCtrl';🚫↵
```
[}]: #

Connect the chats view to the `ChatsCtrl`:

[{]: <helper> (diff_step 1.13)
#### Step 1.13: Connect chats controller to chats view

##### Changed client/scripts/routes.js
```diff
@@ -15,7 +15,8 @@
 ┊15┊15┊        url: '/chats',
 ┊16┊16┊        views: {
 ┊17┊17┊          'tab-chats': {
-┊18┊  ┊            templateUrl: chatsTemplateUrl
+┊  ┊18┊            templateUrl: chatsTemplateUrl,
+┊  ┊19┊            controller: 'ChatsCtrl as chats'
 ┊19┊20┊          }
 ┊20┊21┊        }
 ┊21┊22┊      });
```
[}]: #

Note that we used the `controllerAs` syntax with the `chats` value. This means that that the controller should be accessed from the scope through a data model called `chats`, which is just a reference to the scope.

Now we will make the data stubs appear in our view.

We will use `Ionic`'s directives to create a container with a list view (`ion-list` and `ion-item`), and add `ng-repeat` to iterate over the chats:

[{]: <helper> (diff_step 1.14)
#### Step 1.14: Add data stub to chats view

##### Changed client/templates/chats.html
```diff
@@ -1,5 +1,15 @@
 ┊ 1┊ 1┊<ion-view view-title="Chats">
 ┊ 2┊ 2┊  <ion-content>
-┊ 3┊  ┊
+┊  ┊ 3┊    <ion-list>
+┊  ┊ 4┊      <ion-item ng-repeat="chat in chats.data | orderBy:'-lastMessage.timestamp'"
+┊  ┊ 5┊                class="item-chat item-remove-animate item-avatar item-icon-right"
+┊  ┊ 6┊                type="item-text-wrap">
+┊  ┊ 7┊        <img ng-src="{{ chat.picture }}">
+┊  ┊ 8┊        <h2>{{ chat.name }}</h2>
+┊  ┊ 9┊        <p>{{ chat.lastMessage.text }}</p>
+┊  ┊10┊        <span class="last-message-timestamp">{{ chat.lastMessage.timestamp }}</span>
+┊  ┊11┊        <i class="icon ion-chevron-right icon-accessory"></i>
+┊  ┊12┊      </ion-item>
+┊  ┊13┊    </ion-list>
 ┊ 4┊14┊  </ion-content>
 ┊ 5┊15┊</ion-view>🚫↵
```
[}]: #

And this is how it looks like:



You might notice that the dates are not formatted, so let's create a simple `AngularJS` filter that uses `moment` npm package to convert the date into a formatted text, we will place it in a file named `client/scripts/filters/calendar.filter.js`:

[{]: <helper> (diff_step 1.15)
#### Step 1.15: Create calendar filter

##### Added client/scripts/filters/calendar.filter.js
```diff
@@ -0,0 +1,17 @@
+┊  ┊ 1┊import Moment from 'moment';
+┊  ┊ 2┊import { Filter } from 'angular-ecmascript/module-helpers';
+┊  ┊ 3┊
+┊  ┊ 4┊export default class CalendarFilter extends Filter {
+┊  ┊ 5┊  filter(time) {
+┊  ┊ 6┊    if (!time) return;
+┊  ┊ 7┊
+┊  ┊ 8┊    return Moment(time).calendar(null, {
+┊  ┊ 9┊      lastDay : '[Yesterday]',
+┊  ┊10┊      sameDay : 'LT',
+┊  ┊11┊      lastWeek : 'dddd',
+┊  ┊12┊      sameElse : 'DD/MM/YY'
+┊  ┊13┊    });
+┊  ┊14┊  }
+┊  ┊15┊}
+┊  ┊16┊
+┊  ┊17┊CalendarFilter.$name = 'calendar';🚫↵
```
[}]: #

[{]: <helper> (diff_step 1.16)
#### Step 1.16: Load calendar filter

##### Changed client/scripts/lib/app.js
```diff
@@ -10,6 +10,7 @@
 ┊10┊10┊
 ┊11┊11┊// Modules
 ┊12┊12┊import ChatsCtrl from '../controllers/chats.controller';
+┊  ┊13┊import CalendarFilter from '../filters/calendar.filter';
 ┊13┊14┊import RoutesConfig from '../routes';
 ┊14┊15┊
 ┊15┊16┊const App = 'Whatsapp';
```
```diff
@@ -22,6 +23,7 @@
 ┊22┊23┊
 ┊23┊24┊new Loader(App)
 ┊24┊25┊  .load(ChatsCtrl)
+┊  ┊26┊  .load(CalendarFilter)
 ┊25┊27┊  .load(RoutesConfig);
 ┊26┊28┊
 ┊27┊29┊// Startup
```
[}]: #

And let's use it in our view:

[{]: <helper> (diff_step 1.17)
#### Step 1.17: Apply calendar filter to chats view

##### Changed client/templates/chats.html
```diff
@@ -7,7 +7,7 @@
 ┊ 7┊ 7┊        <img ng-src="{{ chat.picture }}">
 ┊ 8┊ 8┊        <h2>{{ chat.name }}</h2>
 ┊ 9┊ 9┊        <p>{{ chat.lastMessage.text }}</p>
-┊10┊  ┊        <span class="last-message-timestamp">{{ chat.lastMessage.timestamp }}</span>
+┊  ┊10┊        <span class="last-message-timestamp">{{ chat.lastMessage.timestamp | calendar }}</span>
 ┊11┊11┊        <i class="icon ion-chevron-right icon-accessory"></i>
 ┊12┊12┊      </ion-item>
 ┊13┊13┊    </ion-list>
```
[}]: #


To add a delete button to our view, we will use a `ion-option-button` which is a button that's visible when we swipe over the list item.

[{]: <helper> (diff_step 1.18)
#### Step 1.18: Add delete button to chats view

##### Changed client/templates/chats.html
```diff
@@ -9,6 +9,9 @@
 ┊ 9┊ 9┊        <p>{{ chat.lastMessage.text }}</p>
 ┊10┊10┊        <span class="last-message-timestamp">{{ chat.lastMessage.timestamp | calendar }}</span>
 ┊11┊11┊        <i class="icon ion-chevron-right icon-accessory"></i>
+┊  ┊12┊        <ion-option-button class="button-assertive" ng-click="chats.remove(chat)">
+┊  ┊13┊          Delete
+┊  ┊14┊        </ion-option-button>
 ┊12┊15┊      </ion-item>
 ┊13┊16┊    </ion-list>
 ┊14┊17┊  </ion-content>
```
[}]: #

Implement the `remove(chat)` method inside our `ChatsCtrl`:

[{]: <helper> (diff_step 1.19)
#### Step 1.19: Add delete button logic to chats controller

##### Changed client/scripts/controllers/chats.controller.js
```diff
@@ -53,6 +53,10 @@
 ┊53┊53┊      }
 ┊54┊54┊    ];
 ┊55┊55┊  }
+┊  ┊56┊
+┊  ┊57┊  remove(chat) {
+┊  ┊58┊    this.data.splice(this.data.indexOf(chat), 1);
+┊  ┊59┊  }
 ┊56┊60┊}
 ┊57┊61┊
 ┊58┊62┊ChatsCtrl.$name = 'ChatsCtrl';🚫↵
```
[}]: #

Now we want to add some styles and make some small `css` modifications to make it look more like `Whatsapp`.

We want to use `sass` in our project, so we need to add the sass package to our project:

    $ meteor add fourseven:scss

And now we will create our first `sass` file, we will place it under `client/styles/chats.scss`, and add some `css` rules:

[{]: <helper> (diff_step 1.21)
#### Step 1.21: Add chats stylesheet

##### Added client/styles/chats.scss
```diff
@@ -0,0 +1,9 @@
+┊ ┊1┊.item-chat {
+┊ ┊2┊  .last-message-timestamp {
+┊ ┊3┊    position: absolute;
+┊ ┊4┊    top: 16px;
+┊ ┊5┊    right: 38px;
+┊ ┊6┊    font-size: 14px;
+┊ ┊7┊    color: #9A9898;
+┊ ┊8┊  }
+┊ ┊9┊}🚫↵
```
[}]: #

And we are done with this view! As you can probably see it has a `Whatsapp` style theme.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Intro](../../README.md) | [Next Step >](step2.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #