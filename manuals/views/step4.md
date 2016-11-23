[{]: <region> (header)
# Step 4: Authentication
[}]: #
[{]: <region> (body)
On this step we will authenticate and identify users in our app.

Before we go ahead and start extending our app, we will add few packages which will make our lives a bit less complex when it comes to authentication and users management.

First we will add a `Meteor` package called `accounts-phone` which gives us the ability to verify a user using an SMS code:

    $ meteor add npm-bcrypt@0.8.7
    $ meteor add mys:accounts-phone

And second, we will add `angular-meteor-auth` which provides us with authentication related functions:

    $ meteor npm install angular-meteor-auth

Of course, don't forget to load the relevant modules:

[{]: <helper> (diff_step 4.3)
#### Step 4.3: Load angular-meteor-auth module

##### Changed client/scripts/lib/app.js
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊// Libs
 ┊2┊2┊import 'angular-animate';
 ┊3┊3┊import 'angular-meteor';
+┊ ┊4┊import 'angular-meteor-auth';
 ┊4┊5┊import 'angular-moment';
 ┊5┊6┊import 'angular-sanitize';
 ┊6┊7┊import 'angular-ui-router';
```
```diff
@@ -21,6 +22,7 @@
 ┊21┊22┊// App
 ┊22┊23┊Angular.module(App, [
 ┊23┊24┊  'angular-meteor',
+┊  ┊25┊  'angular-meteor.auth',
 ┊24┊26┊  'angularMoment',
 ┊25┊27┊  'ionic'
 ┊26┊28┊]);
```
[}]: #

In order to make the SMS verification work we will need to create a file located in `server/sms.js` with the following contents:

[{]: <helper> (diff_step 4.4)
#### Step 4.4: Add SMS configuration

##### Added server/sms.js
```diff
@@ -0,0 +1,7 @@
+┊ ┊1┊import { Meteor } from 'meteor/meteor';
+┊ ┊2┊import { Accounts } from 'meteor/accounts-base';
+┊ ┊3┊
+┊ ┊4┊if (Meteor.settings && Meteor.settings.ACCOUNTS_PHONE) {
+┊ ┊5┊  Accounts._options.adminPhoneNumbers = Meteor.settings.ACCOUNTS_PHONE.ADMIN_NUMBERS;
+┊ ┊6┊  Accounts._options.phoneVerificationMasterCode = Meteor.settings.ACCOUNTS_PHONE.MASTER_CODE;
+┊ ┊7┊}🚫↵
```
[}]: #

If you would like to test the verification with a real phone number, `accouts-phone` provides an easy access for [twilio's API](https://www.twilio.com/), for more information see [accounts-phone's repo](https://github.com/okland/accounts-phone).

For debugging purposes if you'd like to add admin phone numbers and mater verification codes which will always pass the verification stage, you may add a `settings.json` file at the root folder with the following fields:

    {
      "ACCOUNTS_PHONE": {
        "ADMIN_NUMBERS": ["123456789", "987654321"],
        "MASTER_CODE": "1234"
      }
    }

Now let's create the same flow of `Whatsapp` for authentication: first we need to ask for the user's phone number, verify it with an SMS message and then ask the user to pick his name.

So these flows are created by 3 views: login, confirmation and profile.

Let's add these states, each with HTML template and controller:

[{]: <helper> (diff_step 4.5)
#### Step 4.5: Create auth route states

##### Changed client/scripts/routes.js
```diff
@@ -2,6 +2,9 @@
 ┊ 2┊ 2┊
 ┊ 3┊ 3┊import chatsTemplateUrl from '../templates/chats.html';
 ┊ 4┊ 4┊import chatTemplateUrl from '../templates/chat.html';
+┊  ┊ 5┊import confirmationTemplateUrl from '../templates/confirmation.html';
+┊  ┊ 6┊import loginTemplateUrl from '../templates/login.html';
+┊  ┊ 7┊import profileTemplateUrl from '../templates/profile.html';
 ┊ 5┊ 8┊import tabsTemplateUrl from '../templates/tabs.html';
 ┊ 6┊ 9┊
 ┊ 7┊10┊export default class RoutesConfig extends Config {
```
```diff
@@ -29,6 +32,21 @@
 ┊29┊32┊            controller: 'ChatCtrl as chat'
 ┊30┊33┊          }
 ┊31┊34┊        }
+┊  ┊35┊      })
+┊  ┊36┊      .state('login', {
+┊  ┊37┊        url: '/login',
+┊  ┊38┊        templateUrl: loginTemplateUrl,
+┊  ┊39┊        controller: 'LoginCtrl as logger'
+┊  ┊40┊      })
+┊  ┊41┊      .state('confirmation', {
+┊  ┊42┊        url: '/confirmation/:phone',
+┊  ┊43┊        templateUrl: confirmationTemplateUrl,
+┊  ┊44┊        controller: 'ConfirmationCtrl as confirmation'
+┊  ┊45┊      })
+┊  ┊46┊      .state('profile', {
+┊  ┊47┊        url: '/profile',
+┊  ┊48┊        templateUrl: profileTemplateUrl,
+┊  ┊49┊        controller: 'ProfileCtrl as profile'
 ┊32┊50┊      });
 ┊33┊51┊
 ┊34┊52┊    this.$urlRouterProvider.otherwise('tab/chats');
```
[}]: #

We will now add the view of login state which includes an input and a save button and later we will add a modal dialog to verify the user's phone:

[{]: <helper> (diff_step 4.6)
#### Step 4.6: Add login view

##### Added client/templates/login.html
```diff
@@ -0,0 +1,15 @@
+┊  ┊ 1┊<ion-view title="Your phone number">
+┊  ┊ 2┊  <ion-nav-buttons side="right">
+┊  ┊ 3┊    <button ng-click="logger.login()" ng-disabled="!logger.phone || logger.phone.length === 0" class="button button-clear button-positive">Done</button>
+┊  ┊ 4┊  </ion-nav-buttons>
+┊  ┊ 5┊  <ion-content class="login">
+┊  ┊ 6┊    <div class="text-center instructions">
+┊  ┊ 7┊      Please confirm your country code and enter your phone number
+┊  ┊ 8┊    </div>
+┊  ┊ 9┊    <div class="list">
+┊  ┊10┊      <label class="item item-input">
+┊  ┊11┊        <input ng-model="logger.phone" on-return="logger.login()" type="text" placeholder="Your phone number">
+┊  ┊12┊      </label>
+┊  ┊13┊    </div>
+┊  ┊14┊  </ion-content>
+┊  ┊15┊</ion-view>🚫↵
```
[}]: #

And for the controller the logic is simple, we ask the user to check again his phone number, and then we will use `Accounts` API in order to ask for SMS verification:

[{]: <helper> (diff_step 4.7)
#### Step 4.7: Add login controller

##### Added client/scripts/controllers/login.controller.js
```diff
@@ -0,0 +1,46 @@
+┊  ┊ 1┊import { _ } from 'meteor/underscore';
+┊  ┊ 2┊import { Accounts } from 'meteor/accounts-base';
+┊  ┊ 3┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 4┊
+┊  ┊ 5┊export default class LoginCtrl extends Controller {
+┊  ┊ 6┊  login() {
+┊  ┊ 7┊    if (_.isEmpty(this.phone)) return;
+┊  ┊ 8┊
+┊  ┊ 9┊    const confirmPopup = this.$ionicPopup.confirm({
+┊  ┊10┊      title: 'Number confirmation',
+┊  ┊11┊      template: '<div>' + this.phone + '</div><div>Is your phone number above correct?</div>',
+┊  ┊12┊      cssClass: 'text-center',
+┊  ┊13┊      okText: 'Yes',
+┊  ┊14┊      okType: 'button-positive button-clear',
+┊  ┊15┊      cancelText: 'edit',
+┊  ┊16┊      cancelType: 'button-dark button-clear'
+┊  ┊17┊    });
+┊  ┊18┊
+┊  ┊19┊    confirmPopup.then((res) => {
+┊  ┊20┊      if (!res) return;
+┊  ┊21┊
+┊  ┊22┊      this.$ionicLoading.show({
+┊  ┊23┊        template: 'Sending verification code...'
+┊  ┊24┊      });
+┊  ┊25┊
+┊  ┊26┊      Accounts.requestPhoneVerification(this.phone, (err) => {
+┊  ┊27┊        this.$ionicLoading.hide();
+┊  ┊28┊        if (err) return this.handleError(err);
+┊  ┊29┊        this.$state.go('confirmation', { phone: this.phone });
+┊  ┊30┊      });
+┊  ┊31┊    });
+┊  ┊32┊  }
+┊  ┊33┊
+┊  ┊34┊  handleError(err) {
+┊  ┊35┊    this.$log.error('Login error ', err);
+┊  ┊36┊
+┊  ┊37┊    this.$ionicPopup.alert({
+┊  ┊38┊      title: err.reason || 'Login failed',
+┊  ┊39┊      template: 'Please try again',
+┊  ┊40┊      okType: 'button-positive button-clear'
+┊  ┊41┊    });
+┊  ┊42┊  }
+┊  ┊43┊}
+┊  ┊44┊
+┊  ┊45┊LoginCtrl.$name = 'LoginCtrl';
+┊  ┊46┊LoginCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log'];🚫↵
```
[}]: #

[{]: <helper> (diff_step 4.8)
#### Step 4.8: Load login controller

##### Changed client/scripts/lib/app.js
```diff
@@ -13,6 +13,7 @@
 ┊13┊13┊// Modules
 ┊14┊14┊import ChatsCtrl from '../controllers/chats.controller';
 ┊15┊15┊import ChatCtrl from '../controllers/chat.controller';
+┊  ┊16┊import LoginCtrl from '../controllers/login.controller';
 ┊16┊17┊import InputDirective from '../directives/input.directive';
 ┊17┊18┊import CalendarFilter from '../filters/calendar.filter';
 ┊18┊19┊import RoutesConfig from '../routes';
```
```diff
@@ -30,6 +31,7 @@
 ┊30┊31┊new Loader(App)
 ┊31┊32┊  .load(ChatsCtrl)
 ┊32┊33┊  .load(ChatCtrl)
+┊  ┊34┊  .load(LoginCtrl)
 ┊33┊35┊  .load(InputDirective)
 ┊34┊36┊  .load(CalendarFilter)
 ┊35┊37┊  .load(RoutesConfig);
```
[}]: #

Note that we didn't provide all the settings for `account-phone`, so it will run in debug mode. It means that a real SMS won't be sent now, but if you'd like to receive the verification code just open your terminal and view `Meteor`'s logs.

Our next step would be preventing unauthorized users from viewing contents which they have no permission to. In order to do that we will add a pre-requirement to the relevant routes which will require the user to log-in first. `angular-meteor-auth` provides us with a service which is called `$auth`, and it has a method called `$awaitUser()` which returns a promise that will be resolved only once the user has logged in. For more information about `angular-meteor-auth` see [reference](http://www.angular-meteor.com/api/1.3.6/auth).

[{]: <helper> (diff_step 4.9)
#### Step 4.9: Add resolve to auth routes

##### Changed client/scripts/routes.js
```diff
@@ -8,12 +8,21 @@
 ┊ 8┊ 8┊import tabsTemplateUrl from '../templates/tabs.html';
 ┊ 9┊ 9┊
 ┊10┊10┊export default class RoutesConfig extends Config {
+┊  ┊11┊  constructor() {
+┊  ┊12┊    super(...arguments);
+┊  ┊13┊
+┊  ┊14┊    this.isAuthorized = ['$auth', this.isAuthorized.bind(this)];
+┊  ┊15┊  }
+┊  ┊16┊
 ┊11┊17┊  configure() {
 ┊12┊18┊    this.$stateProvider
 ┊13┊19┊      .state('tab', {
 ┊14┊20┊        url: '/tab',
 ┊15┊21┊        abstract: true,
-┊16┊  ┊        templateUrl: tabsTemplateUrl
+┊  ┊22┊        templateUrl: tabsTemplateUrl,
+┊  ┊23┊        resolve: {
+┊  ┊24┊          user: this.isAuthorized
+┊  ┊25┊        }
 ┊17┊26┊      })
 ┊18┊27┊      .state('tab.chats', {
 ┊19┊28┊        url: '/chats',
```
```diff
@@ -46,11 +55,18 @@
 ┊46┊55┊      .state('profile', {
 ┊47┊56┊        url: '/profile',
 ┊48┊57┊        templateUrl: profileTemplateUrl,
-┊49┊  ┊        controller: 'ProfileCtrl as profile'
+┊  ┊58┊        controller: 'ProfileCtrl as profile',
+┊  ┊59┊        resolve: {
+┊  ┊60┊          user: this.isAuthorized
+┊  ┊61┊        }
 ┊50┊62┊      });
 ┊51┊63┊
 ┊52┊64┊    this.$urlRouterProvider.otherwise('tab/chats');
 ┊53┊65┊  }
+┊  ┊66┊
+┊  ┊67┊  isAuthorized($auth) {
+┊  ┊68┊    return $auth.awaitUser();
+┊  ┊69┊  }
 ┊54┊70┊}
 ┊55┊71┊
 ┊56┊72┊RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];🚫↵
```
[}]: #

And now we want to handle a case that this promise does not resolve (In case that the user is not logged in), so let's create a new run block to our `routes.js` file:

[{]: <helper> (diff_step 4.10)
#### Step 4.10: Add routes runner

##### Changed client/scripts/routes.js
```diff
@@ -1,4 +1,5 @@
-┊1┊ ┊import { Config } from 'angular-ecmascript/module-helpers';
+┊ ┊1┊import { _ } from 'meteor/underscore';
+┊ ┊2┊import { Config, Runner } from 'angular-ecmascript/module-helpers';
 ┊2┊3┊
 ┊3┊4┊import chatsTemplateUrl from '../templates/chats.html';
 ┊4┊5┊import chatTemplateUrl from '../templates/chat.html';
```
```diff
@@ -7,7 +8,7 @@
 ┊ 7┊ 8┊import profileTemplateUrl from '../templates/profile.html';
 ┊ 8┊ 9┊import tabsTemplateUrl from '../templates/tabs.html';
 ┊ 9┊10┊
-┊10┊  ┊export default class RoutesConfig extends Config {
+┊  ┊11┊class RoutesConfig extends Config {
 ┊11┊12┊  constructor() {
 ┊12┊13┊    super(...arguments);
 ┊13┊14┊
```
```diff
@@ -69,4 +70,20 @@
 ┊69┊70┊  }
 ┊70┊71┊}
 ┊71┊72┊
-┊72┊  ┊RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];🚫↵
+┊  ┊73┊RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
+┊  ┊74┊
+┊  ┊75┊class RoutesRunner extends Runner {
+┊  ┊76┊  run() {
+┊  ┊77┊    this.$rootScope.$on('$stateChangeError', (...args) => {
+┊  ┊78┊      const err = _.last(args);
+┊  ┊79┊
+┊  ┊80┊      if (err === 'AUTH_REQUIRED') {
+┊  ┊81┊        this.$state.go('login');
+┊  ┊82┊      }
+┊  ┊83┊    });
+┊  ┊84┊  }
+┊  ┊85┊}
+┊  ┊86┊
+┊  ┊87┊RoutesRunner.$inject = ['$rootScope', '$state'];
+┊  ┊88┊
+┊  ┊89┊export default [RoutesConfig, RoutesRunner];🚫↵
```
[}]: #

[{]: <helper> (diff_step 4.11)
#### Step 4.11: Create routes runner

##### Changed client/scripts/lib/app.js
```diff
@@ -16,7 +16,7 @@
 ┊16┊16┊import LoginCtrl from '../controllers/login.controller';
 ┊17┊17┊import InputDirective from '../directives/input.directive';
 ┊18┊18┊import CalendarFilter from '../filters/calendar.filter';
-┊19┊  ┊import RoutesConfig from '../routes';
+┊  ┊19┊import Routes from '../routes';
 ┊20┊20┊
 ┊21┊21┊const App = 'Whatsapp';
 ┊22┊22┊
```
```diff
@@ -34,7 +34,7 @@
 ┊34┊34┊  .load(LoginCtrl)
 ┊35┊35┊  .load(InputDirective)
 ┊36┊36┊  .load(CalendarFilter)
-┊37┊  ┊  .load(RoutesConfig);
+┊  ┊37┊  .load(Routes);
 ┊38┊38┊
 ┊39┊39┊// Startup
 ┊40┊40┊if (Meteor.isCordova) {
```
[}]: #

And now let's add some `css`:

[{]: <helper> (diff_step 4.12)
#### Step 4.12: Add login stylesheet

##### Added client/styles/login.scss
```diff
@@ -0,0 +1,6 @@
+┊ ┊1┊.login {
+┊ ┊2┊  .instructions {
+┊ ┊3┊    margin: 50px 0;
+┊ ┊4┊    padding: 0 15px;
+┊ ┊5┊  }
+┊ ┊6┊}🚫↵
```
[}]: #

The next step is to add the confirmation view, starting with the HTML:

[{]: <helper> (diff_step 4.13)
#### Step 4.13: Add confirmation view

##### Added client/templates/confirmation.html
```diff
@@ -0,0 +1,20 @@
+┊  ┊ 1┊<ion-view title="{{ confirmation.phone }}">
+┊  ┊ 2┊  <ion-nav-buttons side="right">
+┊  ┊ 3┊    <button ng-click="confirmation.confirm()" ng-disabled="!confirmation.code || confirmation.code.length === 0" class="button button-clear button-positive">Done</button>
+┊  ┊ 4┊  </ion-nav-buttons>
+┊  ┊ 5┊
+┊  ┊ 6┊  <ion-content>
+┊  ┊ 7┊    <div class="text-center padding">
+┊  ┊ 8┊      We have sent you an SMS with a code to the number above
+┊  ┊ 9┊    </div>
+┊  ┊10┊    <div class="text-center padding">
+┊  ┊11┊      To complete your phone number verification WhatsApp, please enter the 4-digit activation code.
+┊  ┊12┊    </div>
+┊  ┊13┊
+┊  ┊14┊    <div class="list padding-top">
+┊  ┊15┊      <label class="item item-input">
+┊  ┊16┊        <input ng-model="confirmation.code" on-return="confirmation.confirm()" type="text" placeholder="Code">
+┊  ┊17┊      </label>
+┊  ┊18┊    </div>
+┊  ┊19┊  </ion-content>
+┊  ┊20┊</ion-view>🚫↵
```
[}]: #

And the controller:

[{]: <helper> (diff_step 4.14)
#### Step 4.14: Create confirmation controller

##### Added client/scripts/controllers/confirmation.controller.js
```diff
@@ -0,0 +1,33 @@
+┊  ┊ 1┊import { _ } from 'meteor/underscore';
+┊  ┊ 2┊import { Accounts } from 'meteor/accounts-base';
+┊  ┊ 3┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 4┊
+┊  ┊ 5┊export default class ConfirmationCtrl extends Controller {
+┊  ┊ 6┊  constructor() {
+┊  ┊ 7┊    super(...arguments);
+┊  ┊ 8┊
+┊  ┊ 9┊    this.phone = this.$state.params.phone;
+┊  ┊10┊  }
+┊  ┊11┊
+┊  ┊12┊  confirm() {
+┊  ┊13┊    if (_.isEmpty(this.code)) return;
+┊  ┊14┊
+┊  ┊15┊    Accounts.verifyPhone(this.phone, this.code, (err) => {
+┊  ┊16┊      if (err) return this.handleError(err);
+┊  ┊17┊      this.$state.go('profile');
+┊  ┊18┊    });
+┊  ┊19┊  }
+┊  ┊20┊
+┊  ┊21┊  handleError(err) {
+┊  ┊22┊    this.$log.error('Confirmation error ', err);
+┊  ┊23┊
+┊  ┊24┊    this.$ionicPopup.alert({
+┊  ┊25┊      title: err.reason || 'Confirmation failed',
+┊  ┊26┊      template: 'Please try again',
+┊  ┊27┊      okType: 'button-positive button-clear'
+┊  ┊28┊    });
+┊  ┊29┊  }
+┊  ┊30┊}
+┊  ┊31┊
+┊  ┊32┊ConfirmationCtrl.$name = 'ConfirmationCtrl';
+┊  ┊33┊ConfirmationCtrl.$inject = ['$state', '$ionicPopup', '$log'];🚫↵
```
[}]: #

[{]: <helper> (diff_step 4.15)
#### Step 4.15: Load confirmation controller

##### Changed client/scripts/lib/app.js
```diff
@@ -13,6 +13,7 @@
 ┊13┊13┊// Modules
 ┊14┊14┊import ChatsCtrl from '../controllers/chats.controller';
 ┊15┊15┊import ChatCtrl from '../controllers/chat.controller';
+┊  ┊16┊import ConfirmationCtrl from '../controllers/confirmation.controller';
 ┊16┊17┊import LoginCtrl from '../controllers/login.controller';
 ┊17┊18┊import InputDirective from '../directives/input.directive';
 ┊18┊19┊import CalendarFilter from '../filters/calendar.filter';
```
```diff
@@ -31,6 +32,7 @@
 ┊31┊32┊new Loader(App)
 ┊32┊33┊  .load(ChatsCtrl)
 ┊33┊34┊  .load(ChatCtrl)
+┊  ┊35┊  .load(ConfirmationCtrl)
 ┊34┊36┊  .load(LoginCtrl)
 ┊35┊37┊  .load(InputDirective)
 ┊36┊38┊  .load(CalendarFilter)
```
[}]: #

We will use `Accounts` API again to verify the user and in case of successful authentication we will transition to the `profile` state, which we will add in the next step.

Let's implement the profile view, which provides the ability to enter the user's nickname and profile picture:

[{]: <helper> (diff_step 4.16)
#### Step 4.16: Add profile view

##### Added client/templates/profile.html
```diff
@@ -0,0 +1,23 @@
+┊  ┊ 1┊<ion-view title="Profile">
+┊  ┊ 2┊  <ion-nav-buttons side="right">
+┊  ┊ 3┊    <button ng-click="profile.updateName()" ng-disabled="!profile.name || profile.name.length === 0" class="button button-clear button-positive">Done</button>
+┊  ┊ 4┊  </ion-nav-buttons>
+┊  ┊ 5┊
+┊  ┊ 6┊  <ion-content class="profile">
+┊  ┊ 7┊    <a class="profile-picture positive">
+┊  ┊ 8┊      <div class="upload-placehoder">
+┊  ┊ 9┊        Add photo
+┊  ┊10┊      </div>
+┊  ┊11┊    </a>
+┊  ┊12┊
+┊  ┊13┊    <div class="instructions">
+┊  ┊14┊      Enter your name and add an optional profile picture
+┊  ┊15┊    </div>
+┊  ┊16┊
+┊  ┊17┊    <div class="list profile-name">
+┊  ┊18┊      <label class="item item-input">
+┊  ┊19┊        <input ng-model="profile.name" on-return="profile.updateName()" type="text" placeholder="Your name">
+┊  ┊20┊      </label>
+┊  ┊21┊    </div>
+┊  ┊22┊  </ion-content>
+┊  ┊23┊</ion-view>🚫↵
```
[}]: #

And the controller:

[{]: <helper> (diff_step 4.17)
#### Step 4.17: Create profile controller

##### Added client/scripts/controllers/profile.controller.js
```diff
@@ -0,0 +1,33 @@
+┊  ┊ 1┊import { _ } from 'meteor/underscore';
+┊  ┊ 2┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 3┊
+┊  ┊ 4┊export default class ProfileCtrl extends Controller {
+┊  ┊ 5┊  constructor() {
+┊  ┊ 6┊    super(...arguments);
+┊  ┊ 7┊
+┊  ┊ 8┊    const profile = this.currentUser && this.currentUser.profile;
+┊  ┊ 9┊    this.name = profile ? profile.name : '';
+┊  ┊10┊  }
+┊  ┊11┊
+┊  ┊12┊  updateName() {
+┊  ┊13┊    if (_.isEmpty(this.name)) return;
+┊  ┊14┊
+┊  ┊15┊    this.callMethod('updateName', this.name, (err) => {
+┊  ┊16┊      if (err) return this.handleError(err);
+┊  ┊17┊      this.$state.go('tab.chats');
+┊  ┊18┊    });
+┊  ┊19┊  }
+┊  ┊20┊
+┊  ┊21┊  handleError(err) {
+┊  ┊22┊    this.$log.error('Profile save error ', err);
+┊  ┊23┊
+┊  ┊24┊    this.$ionicPopup.alert({
+┊  ┊25┊      title: err.reason || 'Save failed',
+┊  ┊26┊      template: 'Please try again',
+┊  ┊27┊      okType: 'button-positive button-clear'
+┊  ┊28┊    });
+┊  ┊29┊  }
+┊  ┊30┊}
+┊  ┊31┊
+┊  ┊32┊ProfileCtrl.$name = 'ProfileCtrl';
+┊  ┊33┊ProfileCtrl.$inject = ['$state', '$ionicPopup', '$log'];🚫↵
```
[}]: #

[{]: <helper> (diff_step 4.18)
#### Step 4.18: Load profile controller

##### Changed client/scripts/lib/app.js
```diff
@@ -15,6 +15,7 @@
 ┊15┊15┊import ChatCtrl from '../controllers/chat.controller';
 ┊16┊16┊import ConfirmationCtrl from '../controllers/confirmation.controller';
 ┊17┊17┊import LoginCtrl from '../controllers/login.controller';
+┊  ┊18┊import ProfileCtrl from '../controllers/profile.controller';
 ┊18┊19┊import InputDirective from '../directives/input.directive';
 ┊19┊20┊import CalendarFilter from '../filters/calendar.filter';
 ┊20┊21┊import Routes from '../routes';
```
```diff
@@ -34,6 +35,7 @@
 ┊34┊35┊  .load(ChatCtrl)
 ┊35┊36┊  .load(ConfirmationCtrl)
 ┊36┊37┊  .load(LoginCtrl)
+┊  ┊38┊  .load(ProfileCtrl)
 ┊37┊39┊  .load(InputDirective)
 ┊38┊40┊  .load(CalendarFilter)
 ┊39┊41┊  .load(Routes);
```
[}]: #

And some `css`:

[{]: <helper> (diff_step 4.19)
#### Step 4.19: Add profile stylesheet

##### Added client/styles/profile.scss
```diff
@@ -0,0 +1,40 @@
+┊  ┊ 1┊.profile {
+┊  ┊ 2┊  padding-top: 20px;
+┊  ┊ 3┊
+┊  ┊ 4┊  .profile-picture {
+┊  ┊ 5┊    position: absolute;
+┊  ┊ 6┊    top: 0;
+┊  ┊ 7┊    left: 20px;
+┊  ┊ 8┊    text-align: center;
+┊  ┊ 9┊
+┊  ┊10┊    img {
+┊  ┊11┊      display: block;
+┊  ┊12┊      max-width: 50px;
+┊  ┊13┊      max-height: 50px;
+┊  ┊14┊      width: 100%;
+┊  ┊15┊      height: 100%;
+┊  ┊16┊      border-radius: 50%;
+┊  ┊17┊    }
+┊  ┊18┊
+┊  ┊19┊    .upload-placehoder {
+┊  ┊20┊      width: 50px;
+┊  ┊21┊      height: 50px;
+┊  ┊22┊      padding: 5px;
+┊  ┊23┊      border: 1px solid #808080;
+┊  ┊24┊      border-radius: 50%;
+┊  ┊25┊      line-height: 18px;
+┊  ┊26┊      font-size: 12px;
+┊  ┊27┊    }
+┊  ┊28┊  }
+┊  ┊29┊
+┊  ┊30┊  .instructions {
+┊  ┊31┊    min-height: 60px;
+┊  ┊32┊    padding: 10px 20px 20px 90px;
+┊  ┊33┊    font-size: 14px;
+┊  ┊34┊    color: gray;
+┊  ┊35┊  }
+┊  ┊36┊
+┊  ┊37┊  .profile-name {
+┊  ┊38┊    margin-top: 20px;
+┊  ┊39┊  }
+┊  ┊40┊}🚫↵
```
[}]: #

As you can see, the controller uses the server method `updateName()` which we need to implement in the `lib/methods.js`:

[{]: <helper> (diff_step 4.20)
#### Step 4.20: Add update name method

##### Changed lib/methods.js
```diff
@@ -15,5 +15,19 @@
 ┊15┊15┊    Chats.update(message.chatId, { $set: { lastMessage: message } });
 ┊16┊16┊
 ┊17┊17┊    return messageId;
+┊  ┊18┊  },
+┊  ┊19┊  updateName(name) {
+┊  ┊20┊    if (!this.userId) {
+┊  ┊21┊      throw new Meteor.Error('not-logged-in',
+┊  ┊22┊        'Must be logged in to update his name.');
+┊  ┊23┊    }
+┊  ┊24┊
+┊  ┊25┊    check(name, String);
+┊  ┊26┊
+┊  ┊27┊    if (name.length === 0) {
+┊  ┊28┊      throw Meteor.Error('name-required', 'Must provide a user name');
+┊  ┊29┊    }
+┊  ┊30┊
+┊  ┊31┊    return Meteor.users.update(this.userId, { $set: { 'profile.name': name } });
 ┊18┊32┊  }
 ┊19┊33┊});🚫↵
```
[}]: #

`Meteor` sets the user identity in case of a logged in user into the `this.userId` variable, so we can check if this variable exists in order to verify that the user is logged in.

Now let's add this validation to the `newMessage()` method we created earlier, and also add the identity of the user to each message he sends.

[{]: <helper> (diff_step 4.21)
#### Step 4.21: Bind user to any new message

##### Changed lib/methods.js
```diff
@@ -3,6 +3,11 @@
 ┊ 3┊ 3┊
 ┊ 4┊ 4┊Meteor.methods({
 ┊ 5┊ 5┊  newMessage(message) {
+┊  ┊ 6┊    if (!this.userId) {
+┊  ┊ 7┊      throw new Meteor.Error('not-logged-in',
+┊  ┊ 8┊        'Must be logged in to send message.');
+┊  ┊ 9┊    }
+┊  ┊10┊
 ┊ 6┊11┊    check(message, {
 ┊ 7┊12┊      type: String,
 ┊ 8┊13┊      text: String,
```
```diff
@@ -10,6 +15,7 @@
 ┊10┊15┊    });
 ┊11┊16┊
 ┊12┊17┊    message.timestamp = new Date();
+┊  ┊18┊    message.userId = this.userId;
 ┊13┊19┊
 ┊14┊20┊    const messageId = Messages.insert(message);
 ┊15┊21┊    Chats.update(message.chatId, { $set: { lastMessage: message } });
```
[}]: #

Great, now the last missing feature is logout. Let's add a state for the settings view:

[{]: <helper> (diff_step 4.22)
#### Step 4.22: Add settings route state

##### Changed client/scripts/routes.js
```diff
@@ -6,6 +6,7 @@
 ┊ 6┊ 6┊import confirmationTemplateUrl from '../templates/confirmation.html';
 ┊ 7┊ 7┊import loginTemplateUrl from '../templates/login.html';
 ┊ 8┊ 8┊import profileTemplateUrl from '../templates/profile.html';
+┊  ┊ 9┊import settingsTemplateUrl from '../templates/settings.html';
 ┊ 9┊10┊import tabsTemplateUrl from '../templates/tabs.html';
 ┊10┊11┊
 ┊11┊12┊class RoutesConfig extends Config {
```
```diff
@@ -60,6 +61,15 @@
 ┊60┊61┊        resolve: {
 ┊61┊62┊          user: this.isAuthorized
 ┊62┊63┊        }
+┊  ┊64┊      })
+┊  ┊65┊      .state('tab.settings', {
+┊  ┊66┊        url: '/settings',
+┊  ┊67┊        views: {
+┊  ┊68┊          'tab-settings': {
+┊  ┊69┊            templateUrl: settingsTemplateUrl,
+┊  ┊70┊            controller: 'SettingsCtrl as settings',
+┊  ┊71┊          }
+┊  ┊72┊        }
 ┊63┊73┊      });
 ┊64┊74┊
 ┊65┊75┊    this.$urlRouterProvider.otherwise('tab/chats');
```
[}]: #

And create the view which contains the logout button:

[{]: <helper> (diff_step 4.23)
#### Step 4.23: Add settings view

##### Added client/templates/settings.html
```diff
@@ -0,0 +1,7 @@
+┊ ┊1┊<ion-view view-title="Settings">
+┊ ┊2┊  <ion-content>
+┊ ┊3┊    <div class="padding text-center">
+┊ ┊4┊      <button ng-click="settings.logout()" class="button button-clear button-assertive">Logout</button>
+┊ ┊5┊    </div>
+┊ ┊6┊  </ion-content>
+┊ ┊7┊</ion-view>🚫↵
```
[}]: #

Now let's implement this method inside the `SettingsCtrl`:

[{]: <helper> (diff_step 4.24)
#### Step 4.24: Add settings controller

##### Added client/scripts/controllers/settings.controller.js
```diff
@@ -0,0 +1,23 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 3┊
+┊  ┊ 4┊export default class SettingsCtrl extends Controller {
+┊  ┊ 5┊  logout() {
+┊  ┊ 6┊    Meteor.logout((err) => {
+┊  ┊ 7┊      if (err) return this.handleError(err);
+┊  ┊ 8┊      this.$state.go('login');
+┊  ┊ 9┊    })
+┊  ┊10┊  }
+┊  ┊11┊
+┊  ┊12┊  handleError (err) {
+┊  ┊13┊    this.$log.error('Settings modification error', err);
+┊  ┊14┊
+┊  ┊15┊    this.$ionicPopup.alert({
+┊  ┊16┊      title: err.reason || 'Settings modification failed',
+┊  ┊17┊      template: 'Please try again',
+┊  ┊18┊      okType: 'button-positive button-clear'
+┊  ┊19┊    });
+┊  ┊20┊  }
+┊  ┊21┊}
+┊  ┊22┊
+┊  ┊23┊SettingsCtrl.$inject = ['$state', '$ionicPopup', '$log'];🚫↵
```
[}]: #

[{]: <helper> (diff_step 4.25)
#### Step 4.25: Load settings controller

##### Changed client/scripts/lib/app.js
```diff
@@ -16,6 +16,7 @@
 ┊16┊16┊import ConfirmationCtrl from '../controllers/confirmation.controller';
 ┊17┊17┊import LoginCtrl from '../controllers/login.controller';
 ┊18┊18┊import ProfileCtrl from '../controllers/profile.controller';
+┊  ┊19┊import SettingsCtrl from '../controllers/settings.controller';
 ┊19┊20┊import InputDirective from '../directives/input.directive';
 ┊20┊21┊import CalendarFilter from '../filters/calendar.filter';
 ┊21┊22┊import Routes from '../routes';
```
```diff
@@ -36,6 +37,7 @@
 ┊36┊37┊  .load(ConfirmationCtrl)
 ┊37┊38┊  .load(LoginCtrl)
 ┊38┊39┊  .load(ProfileCtrl)
+┊  ┊40┊  .load(SettingsCtrl)
 ┊39┊41┊  .load(InputDirective)
 ┊40┊42┊  .load(CalendarFilter)
 ┊41┊43┊  .load(Routes);
```
[}]: #


We also need to modify the way we identify our users inside the messages list, so let's do it:

[{]: <helper> (diff_step 4.26)
#### Step 4.26: Classify message ownership

##### Changed client/templates/chat.html
```diff
@@ -5,7 +5,7 @@
 ┊ 5┊ 5┊  <ion-content class="chat" delegate-handle="chatScroll">
 ┊ 6┊ 6┊    <div class="message-list">
 ┊ 7┊ 7┊      <div ng-repeat="message in chat.messages" class="message-wrapper">
-┊ 8┊  ┊        <div class="message" ng-class-even="'message-mine'" ng-class-odd="'message-other'">
+┊  ┊ 8┊        <div class="message" ng-class="message.userId === $root.currentUser._id ? 'message-mine' : 'message-other'">
 ┊ 9┊ 9┊          <div class="message-text">{{ message.text }}</div>
 ┊10┊10┊          <span class="message-timestamp">{{ message.timestamp | amDateFormat: 'HH:mm' }}</span>
 ┊11┊11┊        </div>
```
[}]: #

And the last missing feature is about adding auto-scroll to the messages list in order to keep the view scrolled down when new messages arrive:

[{]: <helper> (diff_step 4.27)
#### Step 4.27: Add auto-scroll to chat controller

##### Changed client/scripts/controllers/chat.controller.js
```diff
@@ -20,6 +20,8 @@
 ┊20┊20┊        return Chats.findOne(this.chatId);
 ┊21┊21┊      }
 ┊22┊22┊    });
+┊  ┊23┊
+┊  ┊24┊    this.autoScroll();
 ┊23┊25┊  }
 ┊24┊26┊
 ┊25┊27┊  sendMessage() {
```
```diff
@@ -56,6 +58,17 @@
 ┊56┊58┊    }
 ┊57┊59┊  }
 ┊58┊60┊
+┊  ┊61┊  autoScroll() {
+┊  ┊62┊    let recentMessagesNum = this.messages.length;
+┊  ┊63┊
+┊  ┊64┊    this.autorun(() => {
+┊  ┊65┊      const currMessagesNum = this.getCollectionReactively('messages').length;
+┊  ┊66┊      const animate = recentMessagesNum != currMessagesNum;
+┊  ┊67┊      recentMessagesNum = currMessagesNum;
+┊  ┊68┊      this.scrollBottom(animate);
+┊  ┊69┊    });
+┊  ┊70┊  }
+┊  ┊71┊
 ┊59┊72┊  scrollBottom(animate) {
 ┊60┊73┊    this.$timeout(() => {
 ┊61┊74┊      this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
```
[}]: #

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step3.md) | [Next Step >](step5.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #