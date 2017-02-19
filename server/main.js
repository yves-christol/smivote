import { Meteor } from 'meteor/meteor';
import { Members } from '../api/members.js';
import { Circles } from '../api/circles.js';
import { Invitations } from '../api/invitations.js';

Meteor.startup(() => {
  // code to run on server at startup
  if (!Circles.findOne({name: "Welcome"})) {
    Meteor.call("circles.create", "Welcome");
  };
});

Accounts.onCreateUser(function(options, user) {
  // Any new user is automatically inviting himself to the Welcome circle
  if (user && user.emails && user.emails.length > 0) {
    console.log("User "+ user.emails[0].address+ " created at "+new Date());
  } else {
    console.log("Failed to create the user");
  }
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;
  return user;
});
