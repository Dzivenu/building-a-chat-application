ReadLog = new Mongo.Collection( 'read-log' );

ReadLog.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

ReadLog.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let ReadLogSchema = new SimpleSchema({
  'channel': {
    type: String,
    label: 'The ID of the channel we\'re logging a read for.'
  },
  'owner': {
    type: String,
    label: 'The ID of the user this read belongs to.'
  },
  'timestamp': {
    type: Date,
    label: 'The date that this read took place.'
  }
});

ReadLog.attachSchema( ReadLogSchema );
