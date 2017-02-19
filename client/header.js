import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Invitations } from '../api/invitations.js';
import { Members } from '../api/members.js';

import './main.html';

Template.header.onCreated(function headerOnCreated() {
  Meteor.subscribe('userData');
  Meteor.subscribe('invitations');
  Meteor.subscribe('members');
});

Template.header.helpers({
  members() {
    return Members.find({});
  },
  isInvited() {
  	return (Meteor.user() && Invitations.findOne({}));
  },
  numInvitations() {
  	return Invitations.find({}).count();
  },
});

