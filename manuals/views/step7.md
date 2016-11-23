[{]: <region> (header)
# Step 7: User profile picture
[}]: #
[{]: <region> (body)
So now we will add an ability to add a user profile image using the device's camera (e.g. phone or laptop).

The first part is to add the `Meteor` package that provides us this ability:

    $ meteor add okland:camera-ui

We will add now a server method for updating the user's profile image, which is just like updating any other string field of the user's profile:

[{]: <helper> (diff_step 7.2)
#### Step 7.2: Add update picture method

##### Changed lib/methods.js
```diff
@@ -77,5 +77,15 @@
 ┊77┊77┊    Messages.remove({ chatId: chatId });
 ┊78┊78┊
 ┊79┊79┊    return Chats.remove({ _id: chatId });
+┊  ┊80┊  },
+┊  ┊81┊  updatePicture(data) {
+┊  ┊82┊    if (!this.userId) {
+┊  ┊83┊      throw new Meteor.Error('not-logged-in',
+┊  ┊84┊        'Must be logged in to update his picture.');
+┊  ┊85┊    }
+┊  ┊86┊
+┊  ┊87┊    check(data, String);
+┊  ┊88┊
+┊  ┊89┊    return Meteor.users.update(this.userId, { $set: { 'profile.picture': data } });
 ┊80┊90┊  }
 ┊81┊91┊});🚫↵
```
[}]: #

The next step is adding the button for adding/editing the user's profile image, we will add it in the `profile` state, so update the view first:

[{]: <helper> (diff_step 7.3)
#### Step 7.3: Add update picture button to profile view

##### Changed client/templates/profile.html
```diff
@@ -4,8 +4,12 @@
 ┊ 4┊ 4┊  </ion-nav-buttons>
 ┊ 5┊ 5┊
 ┊ 6┊ 6┊  <ion-content class="profile">
-┊ 7┊  ┊    <a class="profile-picture positive">
-┊ 8┊  ┊      <div class="upload-placehoder">
+┊  ┊ 7┊    <a class="profile-picture positive" ng-click="profile.updatePicture()">
+┊  ┊ 8┊      <div ng-if="profile.currentUser.profile.picture">
+┊  ┊ 9┊        <img ng-src="{{ profile.currentUser.profile.picture }}" alt="profile picture">
+┊  ┊10┊        edit
+┊  ┊11┊      </div>
+┊  ┊12┊      <div ng-if="!profile.currentUser.profile.picture" class="upload-placehoder">
 ┊ 9┊13┊        Add photo
 ┊10┊14┊      </div>
 ┊11┊15┊    </a>
```
[}]: #

And now we will implement the controller methods, which will use `Camera-UI` API for getting the image from the device, and then we will use that image and run the server method for updating the image:

[{]: <helper> (diff_step 7.4)
#### Step 7.4: Add update picture logic to profile controller

##### Changed client/scripts/controllers/profile.controller.js
```diff
@@ -1,4 +1,5 @@
 ┊1┊1┊import { _ } from 'meteor/underscore';
+┊ ┊2┊import { MeteorCameraUI } from 'meteor/okland:camera-ui';
 ┊2┊3┊import { Controller } from 'angular-ecmascript/module-helpers';
 ┊3┊4┊
 ┊4┊5┊export default class ProfileCtrl extends Controller {
```
```diff
@@ -9,6 +10,21 @@
 ┊ 9┊10┊    this.name = profile ? profile.name : '';
 ┊10┊11┊  }
 ┊11┊12┊
+┊  ┊13┊  updatePicture () {
+┊  ┊14┊    MeteorCameraUI.getPicture({ width: 60, height: 60 }, (err, data) => {
+┊  ┊15┊      if (err) return this.handleError(err);
+┊  ┊16┊
+┊  ┊17┊      this.$ionicLoading.show({
+┊  ┊18┊        template: 'Updating picture...'
+┊  ┊19┊      });
+┊  ┊20┊
+┊  ┊21┊      this.callMethod('updatePicture', data, (err) => {
+┊  ┊22┊        this.$ionicLoading.hide();
+┊  ┊23┊        this.handleError(err);
+┊  ┊24┊      });
+┊  ┊25┊    });
+┊  ┊26┊  }
+┊  ┊27┊
 ┊12┊28┊  updateName() {
 ┊13┊29┊    if (_.isEmpty(this.name)) return;
 ┊14┊30┊
```
```diff
@@ -19,6 +35,7 @@
 ┊19┊35┊  }
 ┊20┊36┊
 ┊21┊37┊  handleError(err) {
+┊  ┊38┊    if (err.error == 'cancel') return;
 ┊22┊39┊    this.$log.error('Profile save error ', err);
 ┊23┊40┊
 ┊24┊41┊    this.$ionicPopup.alert({
```
```diff
@@ -30,4 +47,4 @@
 ┊30┊47┊}
 ┊31┊48┊
 ┊32┊49┊ProfileCtrl.$name = 'ProfileCtrl';
-┊33┊  ┊ProfileCtrl.$inject = ['$state', '$ionicPopup', '$log'];🚫↵
+┊  ┊50┊ProfileCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log'];
```
[}]: #

We will add now some `css` for better layout of the profile page:

[{]: <helper> (diff_step 7.5)
#### Step 7.5: Update profile stylesheet

##### Changed client/styles/profile.scss
```diff
@@ -11,6 +11,8 @@
 ┊11┊11┊      display: block;
 ┊12┊12┊      max-width: 50px;
 ┊13┊13┊      max-height: 50px;
+┊  ┊14┊      min-width: 50px;
+┊  ┊15┊      min-height: 50px;
 ┊14┊16┊      width: 100%;
 ┊15┊17┊      height: 100%;
 ┊16┊18┊      border-radius: 50%;
```
[}]: #

Now to ease the access to the profile page, we will add a link in the settings view:

[{]: <helper> (diff_step 7.6)
#### Step 7.6: Add reference to profile from settings view

##### Changed client/templates/settings.html
```diff
@@ -3,5 +3,11 @@
 ┊ 3┊ 3┊    <div class="padding text-center">
 ┊ 4┊ 4┊      <button ng-click="settings.logout()" class="button button-clear button-assertive">Logout</button>
 ┊ 5┊ 5┊    </div>
+┊  ┊ 6┊    <ion-list>
+┊  ┊ 7┊      <ion-item href="#/profile" class="item-icon-right">
+┊  ┊ 8┊        Profile
+┊  ┊ 9┊        <i class="icon ion-chevron-right icon-accessory"></i>
+┊  ┊10┊      </ion-item>
+┊  ┊11┊    </ion-list>
 ┊ 6┊12┊  </ion-content>
-┊ 7┊  ┊</ion-view>🚫↵
+┊  ┊13┊</ion-view>
```
[}]: #

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step6.md) | [Next Step >](step8.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #