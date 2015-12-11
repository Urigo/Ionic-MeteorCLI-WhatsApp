Meteor.publish('users', function () {
  return Meteor.users.find({}, { fields: { profile: 1 } });
});

Meteor.publishComposite('chats', function () {
  if (! this.userId) return;

  return {
    find() {
      return Chats.find({ userIds: this.userId });
    },
    children: [
      {
        find(chat) {
          return Messages.find({ chatId: chat._id });
        }
      },
      {
        find(chat) {
          let query = { _id: { $in: chat.userIds } };
          let options = { fields: { profile: 1 } };

          return Meteor.users.find(query, options);
        }
      }
    ]
  };
});