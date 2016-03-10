let _getChannel = ( { channel, isDirect } ) => {
  if ( isDirect ) {
    channel = channel.replace( '@', '' );
    let user = Meteor.users.findOne( { username: channel } );
    return user ? user._id : '';
  } else {
    let publicChannel = Channels.findOne( { name: channel } );
    return publicChannel ? publicChannel._id : '';
  }
};

export default function( filter, userId ) {
  let channel = _getChannel( filter );
  // ReadLog.upsert( { channel: channel, owner: userId }, {
  //   $set: {
  //     timestamp: new Date()
  //   }
  // });
}
