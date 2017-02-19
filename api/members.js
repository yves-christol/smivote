import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Circles } from '../api/circles.js';
import { Alerts } from '../api/alerts.js';

export const Members = new Mongo.Collection('members');

if (Meteor.isServer) {
  Meteor.publish('members', function membersPublication() {
    var currentUser = this.userId;
    if (currentUser) {
      return Members.find({userId: currentUser});
    }
    return this.ready();
  });
}

Meteor.methods({
  'members.join' (circle, role) {
    check(circle, String);
    check(role, String);
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    };
    // check the circle exists
    var actualCircle = Circles.findOne({name: circle});
    if (actualCircle) {
      // check user is not already a member
      if (Members.findOne({userId: this.userId, circleId: actualCircle._id})) {
        Meteor.call("alerts.add", "You're already a member of "+circle, "warning");
      } else {
        Members.insert({
          userId: this.userId,
          circleId: actualCircle._id,
          circle,
          role,
          createdAt: new Date(),
        });
        Meteor.call("alerts.add", "You joined "+circle, "success");
      }
    } else {
      Meteor.call("alerts.add", "You tried to join "+circle+" but it doesn't exist", "warning");
    }
  },
  'members.quit' (circle) {
    check(circle, String);
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    };
    var memberId = Members.findOne({userId: this.userId, circle: circle});
    if (memberId) {
      Members.remove(memberId);
      Meteor.call("alerts.add", "You quitted circle "+circle, "info");
    };
  },
});