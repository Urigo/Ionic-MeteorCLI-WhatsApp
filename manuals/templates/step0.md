Start by installing the `Meteor` platform if you haven't already (See [reference](https://www.meteor.com/install)).

Create a new project by running these commands in your command line:

    $ meteor create whatsapp
    $ cd whatsapp

Your app now contains a live and ready example. To run our app simply type the following on the command line:

    $ meteor

We can also run our app inside the `iOS` simulator or `Android` emulator, we just need to add the platform so `Meteor` will build the project for the new platform:

    $ meteor add-platform ios

Or

    $ meteor add-platform android

You can find more information about `Meteor` CLI and build tool here:

[https://www.meteor.com/tool](https://www.meteor.com/tool)

For now, let’s remove unnecessary files:

    $ rm -rf server client

Next, we will replace `Blaze` (`Meteor`'s default templating engine) with `AngularJS`'s template engine:

    $ meteor remove blaze-html-templates
    $ meteor add angular-templates

We also need to make sure `Ionic` is installed along with its dependencies:

    $ meteor add dab0mb:ionic-assets
    $ meteor npm install angular@^1.5.8 --save
    $ meteor npm install angular-animate@^1.5.8 --save
    $ meteor npm install angular-sanitize@^1.5.8 --save
    $ meteor npm install angular-ui-router@^0.3.1 --save
    $ meteor npm install ionic-scripts --save
    $ meteor npm install babel-runtime --save

If you're an iOS user you might encounter some issues related to double tapping not being submitted correctly. This is caused due to a package automatically included by `Meteor` and it is called `mobile-experience` so we can have a more native feeling for our app once running on a mobile device, which is not always right across the board. This package is simply a cluster of the following packages:

- `fastclick` - Avoid the 300ms touch delay.
- `mobile-status-bar` - Avoid the status bar information covering up your app content.
- `launch-screen` - Cover the app with a launch image so that people don’t have to see things loading.

You can already figure out that the `fastclick` is a potential basis for our issue. So we will install the same packages `mobile-experience` provides us with, with an exception of `fastclick`:

    $ meteor add mobile-status-bar
    $ meteor add launch-screen

And finally, we will install `angular-meteor`, of which this tutorial is all about:

    $ meteor npm install angular-meteor --save