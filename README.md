# Cloud functions - listener project

This is a simple script to act as a bridge between the Pub/Sub system and Firestore (for
data ingest), and Firestore and clients (for data use). Ingest unpacks the binary format
recieved by the MQTT bridge (double,double, ...uint16_t).