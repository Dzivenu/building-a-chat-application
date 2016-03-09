// // import initReadLogs from '../../modules/init-read-logs';
//
// Meteor.publish( 'readLog', function() {
//   // initReadLogs( this.userId );
//
//   let channels = Channels.find( {}, { fields: { _id: 1 } } ).fetch(),
//       users    = Meteor.users.find( { _id: { $ne: this.userId } }, { fields: { _id: 1 } } ).fetch(),
//       sources  = channels.concat( users );
//
//   for ( let i = 0; i < sources.length; i++ ) {
//     let channelId = sources[ i ]._id,
//         log       = ReadLog.findOne( { channel: channelId, owner: this.userId } );
//
//     if ( log ) {
//       Counts.publish(
//         this,
//         `unread_${ this.userId }_${ channelId }`,
//         Messages.find({
//           $or: [
//             { channel: channelId, owner: { $ne: this.userId }, timestamp: { $gte: log.timestamp } },
//             { owner: channelId, to: this.userId, timestamp: { $gte: log.timestamp } }
//           ]
//         })
//       );
//     }
//   }
//   return [];
// });
