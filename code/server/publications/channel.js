Meteor.publish( 'channel', function( isDirect, channel ) {
  check( isDirect, Boolean );
  check( channel, String );
  
  let updateLog = ( query ) => {
    ReadLog.upsert( query, { $set: { timestamp: new Date() } } );
  };

  if ( isDirect ) {
    let user = Meteor.users.findOne( { username: channel.replace( '@', '' ) } );
    updateLog( { channel: user._id, owner: this.userId }, this.userId );
    return Messages.find({
      $or: [ { owner: this.userId, to: user._id }, { owner: user._id, to: this.userId } ]
    });;
  } else {
    let selectedChannel = Channels.findOne( { name: channel } );
    updateLog( { channel: selectedChannel._id, owner: this.userId }, this.userId );
    return Messages.find( { channel: selectedChannel._id } );
  }
});
