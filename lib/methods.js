Meteor.methods({
  newMessage (message) {
    message.timestamp = new Date();

    let messageId = Messages.insert(message);
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return messageId;
  }
});