let setScroll = ( type ) => {
  let messages = document.getElementById( 'messages' ),
      changing = type === 'changeChannel';

  if ( changing ) { messages.style.opacity = 0; }

  setTimeout( () => { messages.scrollTop = messages.scrollHeight; }, 100 );
  setTimeout( () => { if ( changing ) { messages.style.opacity = 1; } }, 200 );
};

Template.channel.onCreated( () => {
  let template = Template.instance();

  template.isDirect = new ReactiveVar();

  Tracker.autorun( () => {
    FlowRouter.watchPathChange();
    let channel  = FlowRouter.getParam( 'channel' ),
        isDirect = channel.includes( '@' );

    template.isDirect.set( isDirect );
    template.subscribe( 'channel', isDirect, channel, () => {
      setScroll( 'changeChannel' );
    });
  });
});

Template.channel.onRendered( () => {
  setScroll();

  Messages.find().observeChanges({
    add() { setScroll( 'newMessage' ); }
  })
});

Template.channel.helpers({
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

      Meteor.call( 'insertMessage', message, ( error ) => {
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
        } else {
          event.target.value = '';
          setScroll( 'newMessage' );
        }
      });
    }
  }
});
