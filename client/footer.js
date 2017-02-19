import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import moment from 'moment';
import { Alerts } from '../api/alerts.js';

import './main.html';

Template.footer.onCreated(function headerOnCreated() {
  Meteor.subscribe('alerts');
});

Template.footer.helpers({
  alerts() {
    return Alerts.find({});
  },
  fromNow(date) {    
    if (date) {
      return moment(date).fromNow();
    } else {
      return "sometime ago";
    }
  },
});

Template.footer.events({
  'click button'(event, instance) {
    var action = event.target.name;
    if (action) {
      console.log("Event action : "+action)
      // console.log("This._id : "+this._id);
      if (Meteor.user()) {
        if (action == "discard") {
          Meteor.call("alerts.remove", this._id);
        }
      };
    };
  },
});

