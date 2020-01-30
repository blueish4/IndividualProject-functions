
const  {Firestore} = require('@google-cloud/firestore');

const firestore = new Firestore();
/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.newData = (event, context) => {
  let doc = firestore.collection('frequencies').doc();
  const pubsubValues = Buffer.from(event.data, 'base64').toString().split(' ');
  doc.create({
    "31.5": pubsubValues[0],
    "everything": pubsubValues,
    "timestamp": event.timestamp,
    "device": event.attributes.deviceId
  });
  console.log(event);
  console.log(pubsubValues);
};

exports.getLatest = (req, res) => {
  const latest = await firestore.collection('frequencies').where('device', '==', 'node-1').orderBy('timestamp', 'desc').limit(1).get();
  res.send(latest);
};