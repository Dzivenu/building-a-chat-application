let fetchUnreadCount = ( template ) => {
  let channel = FlowRouter.getParam( 'channel' );

  if ( channel ) {
    let isDirect = channel.includes( '@' ),
        filter   = { channel: channel, isDirect: isDirect };

    Meteor.call( 'getUnreadCount', filter, ( error, response ) => {
      if ( error ) {
        console.log( error );
      } else {
        template.counts.set( response );
      }
    });
  }
};

Template.sidebar.onCreated( () => {
  let template = Template.instance();

  template.counts = new ReactiveVar( {} );
  template.subscribe( 'sidebar' );

  // ReadLog.find().observeChanges( { changed() { fetchUnreadCount( template ); } } );
  // Messages.find().observeChanges( { added() { fetchUnreadCount( template ); } } );
});

Template.sidebar.helpers({
  currentChannel( name ) {
    let current = FlowRouter.getParam( 'channel' );
    if ( current ) {
      return current === name || current === `@${ name }` ? 'active' : false;
    }
  },
  channels() {
    let channels = Channels.find();
    if ( channels ) {
      return channels;
    }
  },
  users() {
    let users = Meteor.users.find( { _id: { $not: Meteor.userId() } } );
    if ( users ) {
      return users;
    }
  },
  unreadCount( channel ) {
    let counts = Template.instance().counts.get();
    if ( counts ) {
      return counts[ `unread_${ Meteor.userId() }_${ channel }` ];
    }
  },
  fullName( name ) {
    if ( name ) {
      return `${ name.first } ${ name.last }`;
    }
  }
});
