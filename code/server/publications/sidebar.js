Meteor.publish( 'sidebar', function() {
  return [
    Channels.find(),
    Meteor.users.find()
  ];
});
