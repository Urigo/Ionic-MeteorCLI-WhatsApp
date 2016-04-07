import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Filter } from 'angular-ecmascript/module-helpers';

export default class ChatPictureFilter extends Filter {
  filter(chat) {
    if (!chat) return;

    let otherId = _.without(chat.userIds, Meteor.userId())[0];
    let otherUser = Meteor.users.findOne(otherId);
    let hasPicture = otherUser && otherUser.profile && otherUser.profile.picture;

    return hasPicture ? otherUser.profile.picture : chat.picture || '/user-default.svg';
  };
}

ChatPictureFilter.$name = 'chatPicture';