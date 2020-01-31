
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
  let fftPeaks = [];
  let i = 8;
  while(decodedData.length>i){
    fftPeaks.push(decodedData.readUInt16LE(i));
    i+=2; // jump to the next int
  }
  console.log(event);
  console.log(JSON.stringify(fftPeaks));
  doc.create({
    majorPeak,
    "spectra": fftPeaks,
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