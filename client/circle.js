import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Circles } from '../api/circles.js';

import './main.html';

Template.circle.onCreated(function manageOnCreated() {
  var self = this;
  self.autorun(function() {
    var circleId = FlowRouter.getParam('circleId');
    self.subscribe('circles', circleId);  
  });
});

Template.circle.helpers({	
  circle() {
    return Circles.findOne({});
  },
});

Template.circle.events({
  'submit .new-invitation'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const email = target.text.value;
    const circle = this.name;
 
    // Insert a Circle into the collection
    Meteor.call("invitations.send", email, circle);
 
    // Clear form
    target.text.value = '';
  },
});

