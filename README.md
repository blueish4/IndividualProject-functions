# Cloud functions - listener project

This is a simple script to act as a bridge between the Pub/Sub system and Firestore (for
data ingest), and Firestore and clients (for data use). Ingest unpacks the binary format
recieved by the MQTT bridge (double,double, ...uint16_t). 

This is only one part of my final year project, which has a small write up and linkes to
other repos at https://blog.blueish.me/posts/dissertation/
