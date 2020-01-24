
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
    "63": pubsubValues[1],
    "125": pubsubValues[2],
    "everything": pubsubValues,
    "timestamp": new Date(),
    "device": event.data
  });
  console.log(event);
  console.log(pubsubValues);
};
  