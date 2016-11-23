In this step we are going to add several features to our project:

* Create a server and initialize some static data in it.
* Connect the client to the server.

So let’s start by creating some `Mongo` collections which will be used to store our data.

`Mongo` collections need to be available in both client and server in order to share data, so we will declare our collections in a folder named `lib` under the project’s root (`lib/collections.js`).

{{{diff_step 2.1}}}

Now we need to create our server's first file, so let's create a directory named `server` and create the server's startup file named `bootstrap.js` (`server/bootstrap.js`).

This file should be run first because we want to run some initialization code there, so we can use `Meteor.startup()` to define our logic:

{{{diff_step 2.2}}}

Our next step is to move the static data to the server, so let’s add it in the `bootstrap.js` file we just created, we also want this code to run only once when there is no data at all inside the collections.

{{{diff_step 2.3}}}

Now we need to remove the static data from the client and get it from the server.

So let's use `angular-meteor`'s API for this. We will define a helper named `data`, and we will return the `Mongo` collection cursor.

{{{diff_step 2.4}}}

Now that the data comes from the server, we need to modify the `remove()` method in order to use `Mongo` Collection API that removes the object from both client and server:

{{{diff_step 2.5}}}
