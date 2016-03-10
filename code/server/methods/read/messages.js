import initReadLogs from '../../modules/init-read-logs';
import updateReadLogs from '../../modules/update-read-logs';

Meteor.methods({
  getUnreadCount( filter ) {
    check( filter, Object );

    initReadLogs( this.userId );
    updateReadLogs( filter, this.userId );

    let channels = Channels.find( {}, { fields: { _id: 1 } } ).fetch(),
        users    = Meteor.users.find( { _id: { $ne: this.userId } }, { fields: { _id: 1 } } ).fetch(),
        sources  = channels.concat( users ),
        counts   = {};

    for ( let i = 0; i < sources.length; i++ ) {
      let channelId = sources[ i ]._id,
          log       = ReadLog.findOne( { channel: channelId, owner: this.userId } );

      if ( log ) {
        let messagesCount = Messages.find({
          $or: [
            { channel: channelId, owner: { $ne: this.userId }, timestamp: { $gte: log.timestamp } },
            { owner: channelId, to: this.userId, timestamp: { $gte: log.timestamp } }
          ]
        }).count();

        counts[ `unread_${ this.userId }_${ channelId }` ] = messagesCount;
      }
    }

    console.log( counts );

    return counts;
  }
});
