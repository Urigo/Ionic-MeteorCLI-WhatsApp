Meteor.startup(function () {
  if (Chats.find().count() !== 0) return;

  Accounts.createUserWithPhone({
    phone: '+972501234567',
    profile: {
      name: 'My friend 1'
    }
  });

  Accounts.createUserWithPhone({
    phone: '+972501234568',
    profile: {
      name: 'My friend 2'
    }
  });

  Accounts.createUserWithPhone({
    phone: '+972501234569',
    profile: {
      name: 'My friend 3'
    }
  });
});