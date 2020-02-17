
const  {Firestore} = require('@google-cloud/firestore');

const firestore = new Firestore();
/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.newData = (event, context) => {
  const decodedData = Buffer.from(event.data, 'base64');
  let doc = firestore.collection('frequencies').doc();
  const majorPeak = decodedData.readDoubleLE();
  const dba = decodedData.readDoubleLE(8);
  const fftPeaks = [];
  let i = 8*2;
  while(decodedData.length>i){
    fftPeaks.push(decodedData.readUInt16LE(i));
    i+=2; // jump to the next int
  }
  doc.create({
    majorPeak,
    dba,
    "spectra": fftPeaks,
    "timestamp": new Date(),
    "device": event.attributes.deviceId
  });
};

sendSnapshot = snapshot => {
  const docs = snapshot.docs;
  res.set({
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Origin': '*'
  });
  res.send(docs[0].data());
}

exports.getLatest = async (req, res) => {
  firestore.collection('frequencies').orderBy('timestamp', 'desc').limit(1).get().then(sendSnapshot);
};

exports.getHistory = async (req, res) => {
  const startToken = req.query.startToken;
  let query = firestore.collection('frequencies')
  .where('dba', '>', 0)
  .orderBy('timestamp', 'desc')
  .limit(20);

  if (startToken) {
    query.startAfter(startToken);
  }
  query.get().then(sendSnapshot);
};
