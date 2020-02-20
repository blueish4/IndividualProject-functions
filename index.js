
const {Firestore} = require('@google-cloud/firestore');

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

function sendSnapshot(snapshot, res, req) {
  res.set({
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Origin': '*'
  });
  let buffer = [];
  snapshot.forEach(e => {
    buffer.push(e.data());
  });
  res.send(buffer);
}

exports.getLatest = async (req, res) => {
  firestore.collection('frequencies').orderBy('timestamp', 'desc').limit(1).get().then(snapshot => {
    sendSnapshot(snapshot, res, req);
  });
};

exports.getHistory = async (req, res) => {
  const startToken = req.query.startToken;
  let query = firestore.collection('frequencies')
  .orderBy('timestamp', 'desc')
  .limit(20);

  if (startToken) {
    query.startAfter(startToken);
  }
  query.get().then(snapshot => {
    const filtered = snapshot.docs.filter((e) => {
      return e.data().dba > 0;
    });
    sendSnapshot(filtered, res, req);
  });
};
