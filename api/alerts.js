import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Alerts = new Mongo.Collection('alerts');

if (Meteor.isServer) {
  Meteor.publish('alerts', function alertsPublication() {
    var currentUser = this.userId;
    if (currentUser) {
      return Alerts.find({userId: currentUser});
    }
    return this.ready();
  });
}

Meteor.methods({
  'alerts.add' (text, type) {
    check(text, String);
    check(type, String);
    // Make sure the user is logged in before inserting a task
    if (! this.userId || ["success", "info", "warning", "danger"].indexOf(type) < 0) {
      throw new Meteor.Error('not-authorized');
    };
    Alerts.insert({
      userId: this.userId,
      text: text,
      type: type,
      createdAt: new Date(),
    });
  },
  'alerts.remove' (alertId) {
    check(circle, String);
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    };
    // only remove your own alerts
    if (Alerts.findOne({_id: alertId, userId: this.userId})) {
      Members.remove(alertId);
    };
  },
});