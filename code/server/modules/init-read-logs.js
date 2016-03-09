let _getChannels = ( userId ) => {
  let channels = Channels.find( {}, { fields: { _id: 1 } } ).fetch(),
      users    = Meteor.users.find( { _id: { $ne: userId } }, { fields: { _id: 1 } } ).fetch();
  if ( channels && users ) {
    // Combine channels and users (direct messages) and treat as one. The ReadLog
    // is channel/DM agnostic and so user IDs and channel IDs will both be stored
    // in a log's channel field.
    return channels.concat( users );
  }
};

let _checkIfLogExists = ( channelId, userId ) => {
  let log = ReadLog.findOne( { channel: channelId, owner: userId } );
  return log ? log : false;
};

let _insertLog = ( channelId, userId ) => {
  return ReadLog.insert({
    channel: channelId,
    owner: userId,
    timestamp: new Date()
  });
};

let _loopChannelsAndInsertMissingLogs = ( channels, userId ) => {
  for ( let i = 0; i < channels.length; i++ ) {
    let channelId = channels[ i ]._id,
        logExists = _checkIfLogExists( channelId, userId );
    if ( !logExists ) {
      _insertLog( channelId, userId );
    }
  }
};

export default function( userId ) {
  let channels = _getChannels( userId );
  _loopChannelsAndInsertMissingLogs( channels, userId );
}
