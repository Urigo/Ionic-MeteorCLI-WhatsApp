So now we will add an ability to add a user profile image using the device's camera (e.g. phone or laptop).

The first part is to add the `Meteor` package that provides us this ability:

    $ meteor add okland:camera-ui

We will add now a server method for updating the user's profile image, which is just like updating any other string field of the user's profile:

{{{diff_step 7.2}}}

The next step is adding the button for adding/editing the user's profile image, we will add it in the `profile` state, so update the view first:

{{{diff_step 7.3}}}

And now we will implement the controller methods, which will use `Camera-UI` API for getting the image from the device, and then we will use that image and run the server method for updating the image:

{{{diff_step 7.4}}}

We will add now some `css` for better layout of the profile page:

{{{diff_step 7.5}}}

Now to ease the access to the profile page, we will add a link in the settings view:

{{{diff_step 7.6}}}
