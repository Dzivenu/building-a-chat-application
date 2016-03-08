Template.channel.onCreated( () => {
  let template = Template.instance();

  template.isDirect = new ReactiveVar();

  Tracker.autorun( () => {
    FlowRouter.watchPathChange();
    let channel  = FlowRouter.getParam( 'channel' ),
        isDirect = channel.includes( '@' );

    template.isDirect.set( isDirect );
    template.subscribe( 'channel', isDirect, channel );
  });
});

Template.channel.helpers({
  messages() {
    let messages = Messages.find();
    if ( messages ) {
      return messages;
    }
  }
});

Template.channel.events({
  'keyup [name="message"]' ( event, template ) {
    let text = template.find( '[name="message"]' ).value;

    if ( text.trim() !== '' && event.keyCode === 13 ) {
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
        }
      });
    }
  }
});
