Meteor.publish( 'channel', function( isDirect, channel ) {
  check( isDirect, Boolean );
  check( channel, String );

  if ( isDirect ) {
    let user = channel.replace( '@', '' );
    return Messages.find({
      $or: [
        { owner: this.userId, to: user },
        { owner: user, to: this.userId }
      ]
    });
  } else {
    let selectedChannel = Channels.findOne( { name: channel } );
    return selectedChannel ? Messages.find( { channel: selectedChannel._id } ) : [];
  }
});
