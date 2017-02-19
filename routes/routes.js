
FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("main", {content: "welcome"});
  }
});

FlowRouter.route('/welcome', {
  action: function() {
    BlazeLayout.render("main", {content: "welcome"});
  }
});

FlowRouter.route('/about', {
  action: function() {
    BlazeLayout.render("main", {content: "about"});
  }
});

FlowRouter.route('/manage', {
  action: function() {
    BlazeLayout.render("main", {content: "manage"});
  }
});

FlowRouter.route('/circle/:circleId', {
  action: function() {
    BlazeLayout.render("main", {content: "circle"});
  }
});
