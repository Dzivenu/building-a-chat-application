Meteor.publish( 'sidebar', function() {
  return [
    Channels.find(),
    Messages.find( {}, { fields: { _id: 1 } } ),
    Meteor.users.find(),
    ReadLog.find( { owner: this.userId } )
  ];
});
