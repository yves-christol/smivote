import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Members } from '../api/members.js';
import { Alerts } from '../api/alerts.js';

export const Circles = new Mongo.Collection('circles');

if (Meteor.isServer) {
  Meteor.publish('circles', function circlePublication(circleId) {
    let currentUser= this.userId;
    if (! currentUser) {
      throw new Meteor.Error('not-authorized');
    };    
    let isUserAMember = Members.findOne({userId: this.userId, circleId: circleId});
    if (isUserAMember) {
      return Circles.find({_id: circleId});
    }
    return this.ready();
  });
}

Meteor.methods({
  'circles.create'(circle) {
    check(circle, String);
    // check if the circle doesn't exist yet
    if (! Circles.findOne({name: circle})) {
      Circles.insert({
        name: circle,
        owner: this.userId,
        createdAt: new Date(),
      });
      if (this.userId) {
        Meteor.call("members.join", circle, "owner");
        Meteor.call("alerts.add", "You created circle '"+circle, "success")
      };
    }
  },
  'circles.get'(circleId) {
    check(circleId, String);
    return Circles.findOne(circleId);
  },
});