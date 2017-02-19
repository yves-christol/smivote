import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Invitations } from '../api/invitations.js';
import { Members } from '../api/members.js';

import './main.html';

Template.registerHelper('formatDate', function(date) {
  var fdate = ""+(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
  return fdate;
});

Template.manage.onCreated(function manageOnCreated() {
  Meteor.subscribe('userData');
  Meteor.subscribe('invitations');
  Meteor.subscribe('members');
});

Template.manage.helpers({	
  members() {
    return Members.find({});
  },
  invitations() {
  	return Invitations.find({});
  },
})

Template.manage.events({
  'submit .new-circle'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const circle = target.text.value;
 
    // Insert a Circle into the collection
    Meteor.call("circles.create", circle);
 
    // Clear form
    target.text.value = '';
  },
  'click button'(event, instance) {
  	var action = event.target.name;
  	if (action) {
	    // console.log("Event action : "+action)
	    // console.log("This._id : "+this._id);
	    if (Meteor.user()) {
	      if (action == "accept") {
	        Meteor.call("invitations.accept", this._id);
        } else if (action == "reject") {
          Meteor.call("invitations.reject", this._id);
        } else if (action == "quit") {
          Meteor.call("members.quit", this.circle);
        };
  	  };
  	};
  },
});

