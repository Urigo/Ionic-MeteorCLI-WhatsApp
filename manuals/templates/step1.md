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

{{{diff_step 1.1}}}

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

{{{diff_step 1.2}}}

Before we dive into building our app's different components, we need a way to write them using `es6`'s new class system. For this purpose we will use [angular-ecmascript](https://github.com/DAB0mB/angular-ecmascript) npm package. Let's install it:

    $ meteor npm install angular-ecmascript --save

`angular-ecmascript` is a utility library which will help us write an `AngularJS` app using es6's class system.
As for now there is no official way to do so, however using es6 syntax is recommended, hence `angular-ecmascript` was created.

In addition, `angular-ecmascript` provides us with some very handy features, like auto-injection without using any pre-processors like [ng-annotate](https://github.com/olov/ng-annotate), or setting our controller as the view model any time it is created (See [reference](/api/1.3.11/reactive)). The API shouldn't be too complicated to understand, and we will get familiar with it as we make progress with this tutorial.

Our next step is to create the states and routes for the views.

Our app uses `Ionic` to create 5 tabs: `favorites`, `recents`, ` contacts`, `chats`, and `settings`.

We will define our routes and states with [angular-ui-router](https://atmospherejs.com/angularui/angular-ui-router) (which is included by `Ionic`), and at the moment we will add the main page which is the chats tab:

{{{diff_step 1.4}}}

{{{diff_step 1.5}}}

And this is the HTML template for the footer that includes our tabs:

{{{diff_step 1.6}}}

Let's create the stub for our default tab - the chats tab:

{{{diff_step 1.7}}}

Our next step will go through creating basic views with some static data using `Ionic` and css pre-processor called [sass](http://sass-lang.com/).

Let’s create an `AngularJS` controller that we will connect to the chats view later on, and we will call it `ChatsCtrl`:

{{{diff_step 1.9}}}

{{{diff_step 1.10}}}

From now on we will use our controller as the view model using the `controllerAs` syntax, which basically means that instead of defining data models on the `$scope` we will define them on the controller itself using the `this` argument. For more information, see `AngularJS`'s docs about [ngController](https://docs.angularjs.org/api/ng/directive/ngController).

Now we want to add some static data to this controller, we will use `moment` package to easily create time object, so let’s add it to the project using this command:

    $ meteor npm install moment --save

The `moment` package will be added to `package.json` by `npm`:

{{{diff_step 1.11}}}

Now let’s add the static data to the `ChatsCtrl`. We will create a stub schema for chats and messages:

{{{diff_step 1.12}}}

Connect the chats view to the `ChatsCtrl`:

{{{diff_step 1.13}}}

Note that we used the `controllerAs` syntax with the `chats` value. This means that that the controller should be accessed from the scope through a data model called `chats`, which is just a reference to the scope.

Now we will make the data stubs appear in our view.

We will use `Ionic`'s directives to create a container with a list view (`ion-list` and `ion-item`), and add `ng-repeat` to iterate over the chats:

{{{diff_step 1.14}}}

And this is how it looks like:

{{tutorialImage 'whatsapp-meteor' '3.png' 500}}

You might notice that the dates are not formatted, so let's create a simple `AngularJS` filter that uses `moment` npm package to convert the date into a formatted text, we will place it in a file named `client/scripts/filters/calendar.filter.js`:

{{{diff_step 1.15}}}

{{{diff_step 1.16}}}

And let's use it in our view:

{{{diff_step 1.17}}}


To add a delete button to our view, we will use a `ion-option-button` which is a button that's visible when we swipe over the list item.

{{{diff_step 1.18}}}

Implement the `remove(chat)` method inside our `ChatsCtrl`:

{{{diff_step 1.19}}}

Now we want to add some styles and make some small `css` modifications to make it look more like `Whatsapp`.

We want to use `sass` in our project, so we need to add the sass package to our project:

    $ meteor add fourseven:scss

And now we will create our first `sass` file, we will place it under `client/styles/chats.scss`, and add some `css` rules:

{{{diff_step 1.21}}}

And we are done with this view! As you can probably see it has a `Whatsapp` style theme.
