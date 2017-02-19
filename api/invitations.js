import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Alerts } from '../api/alerts.js';

export const Invitations = new Mongo.Collection('invitations');

var isEmailValid = function(address) {
  return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(address);
};

if (Meteor.isServer) {
  Meteor.publish('invitations', function invitationsPublication() {
    var currentUser = this.userId;
    if (currentUser) {
      var user = Meteor.users.findOne({_id: currentUser});
      if (user && user.emails) {
        return Invitations.find({email: user.emails[0].address});
      }
    }
    return this.ready();
  });
}

Meteor.methods({
  'invitations.send'(email, circle) {
    check(email, String);
    check(circle, String);
    // Make sure the user is logged in before inserting a task
    currentUser = this.userId;
    if (! currentUser) {
      throw new Meteor.Error('not-authorized');
    };

    if (isEmailValid(email)) {
      Invitations.insert({
        email,
        circle,
        sender: currentUser,
        createdAt: new Date(),
      });
      Meteor.call("alerts.add", "You successfuly invited "+email+" to join circle "+circle, "info");
    } else {
      Meteor.call("alerts.add", "Invitation not sent because "+email+" is not a valid address", "warning");
    }
  },
  'invitations.accept'(invitationId) {
    var invitation = Invitations.findOne({_id: invitationId});
    if (invitation) {
      Meteor.call("members.join", invitation.circle, "member");
      Invitations.remove(invitationId);
    }
  },
  'invitations.reject'(invitationId) {
    Invitations.remove(invitationId);
    Meteor.call("alerts.add", "You refused to join "+circle, "info");
  },
});