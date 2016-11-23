Our last step would be implementing image messages support. We will use the same package from the previous step to achieve that.

So we will use the same logic of taking the picture in the controller, and call the same `newMessage()` server method:

{{{diff_step 8.1}}}

And now we need to register an `ng-click` event to the image button on the view:

{{{diff_step 8.2}}}

In the server, we need to add a validation scheme for image messages in the `newMessage()` method:

{{{diff_step 8.3}}}

Our next step would be updating the chat view to support image messages:

{{{diff_step 8.4}}}

Let's add some `css` to prevent images from looking silly:

{{{diff_step 8.5}}}

We also want to add image icon on the chats list in case when the last message is an image message, so let's add it:

{{{diff_step 8.6}}}
