import { Filter } from '../entities';

export default class chatName extends Filter {
  filter(chat) {
    if (!chat) return;

    let otherId = _.without(chat.userIds, Meteor.userId())[0];
    let otherUser = Meteor.users.findOne(otherId);
    let hasName = otherUser && otherUser.profile && otherUser.profile.name;

    return hasName ? otherUser.profile.name : chat.name || 'NO NAME';
  }
}
