Meteor.methods({
  newMessage (message) {
    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to send message.');
    }

    check(message, {
      text: String,
      chatId: String
    });

    message.timestamp = new Date();
    message.userId = this.userId;

    let messageId = Messages.insert(message);
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return messageId;
  },
  updateName(name) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update his name.');
    }

    check(name, String);
    if (name.length === 0) {
      throw Meteor.Error('name-required', 'Must proive user name');
    }

    return Meteor.users.update(this.userId, { $set: { 'profile.name': name } });
  },
  newChat(otherId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged to create a chat.');
    }

    check(otherId, String);

    let otherUser = Meteor.users.findOne(otherId);
    if (! otherUser) {
      throw new Meteor.Error('user-not-exists',
        'Chat\'s user not exists');
    }

    let chat = {
      userIds: [this.userId, otherId],
      createdAt: new Date()
    };

    let chatId = Chats.insert(chat);

    return chatId;
  }
});