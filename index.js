
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
  const pubsubValues = Buffer.from(event.data, 'base64').toString().trim().split(' ');
  console.log(event);
  console.log(pubsubValues);
  doc.create({
    "31.5": pubsubValues[0],
    "everything": pubsubValues,
    "timestamp": new Date(),
    "device": event.attributes.deviceId
  });
};

exports.getLatest = async (req, res) => {
  firestore.collection('frequencies').orderBy('timestamp', 'desc').limit(1).get().then(snapshot => {
    const docs = snapshot.docs;
    res.send(docs[0].data());
  });
};