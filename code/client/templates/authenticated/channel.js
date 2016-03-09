let setScroll = ( template ) => {
  let messages = document.getElementById( 'messages' );
  setTimeout( () => { messages.scrollTop = messages.scrollHeight; }, 300 );

  if ( template ) {
    setTimeout( () => { template.loading.set( false ); }, 300 );
  }
};

Template.channel.onCreated( () => {
  let template = Template.instance();

  template.isDirect = new ReactiveVar();
  template.loading  = new ReactiveVar( true );

  Tracker.autorun( () => {
    let channel = FlowRouter.getParam( 'channel' );

    if ( channel ) {
      let isDirect = channel.includes( '@' );

      template.loading.set( true );
      template.isDirect.set( isDirect );

      template.subscribe( 'channel', isDirect, channel, () => {
        setScroll( template );
      });
    }
  });
});

Template.channel.onRendered( () => {
  Messages.find().observeChanges({
    added( id, fields ) {
      setScroll();
    }
  });
});

Template.channel.helpers({
  isLoading() {
    return Template.instance().loading.get();
  },
  isDirect() {
    return Template.instance().isDirect.get();
  },
  username() {
    return FlowRouter.getParam( 'channel' );
  },
  messages() {
    let messages = Messages.find( {}, { sort: { timestamp: 1 } } );
    if ( messages ) {
      let previousMessage;
      return messages.map( ( message ) => {
        if ( typeof previousMessage !== 'undefined' && previousMessage.owner === message.owner ) {
          let previous   = moment( previousMessage.timestamp ),
              current    = moment( message.timestamp ),
              difference = moment( current ).diff( previous, 'minutes' );

          message.showHeader = difference >= 5;
        } else {
          message.showHeader = true;
        }

        previousMessage = message;
        return message;
      });
    }
  }
});

Template.channel.events({
  'keyup [name="message"]' ( event, template ) {
    let text = template.find( '[name="message"]' ).value;

    if ( text.trim() !== '' && event.keyCode === 13 && !event.shiftKey ) {
      let message = {
        destination: FlowRouter.getParam( 'channel' ).replace( '@', '' ),
        isDirect: template.isDirect.get(),
        message: template.find( '[name="message"]' ).value
      };

      setScroll();

      Meteor.call( 'insertMessage', message, ( error ) => {
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
        } else {
          event.target.value = '';
        }
      });
    }
  }
});
