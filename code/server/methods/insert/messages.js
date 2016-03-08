Meteor.methods({
  insertMessage( message ) {
    check( message, {
      destination: String,
      isDirect: Boolean,
      message: String
    });

    message.owner     = Meteor.userId();
    message.timestamp = new Date();

    if ( message.isDirect ) {
      message.to = message.destination;
    } else {
      let channel = Channels.findOne( { name: message.destination }, { fields: { _id: 1 } } );
      message.channel = channel._id;
    }

    delete message.destination;
    delete message.isDirect;

    try {
      return Messages.insert( message );
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  }
});
