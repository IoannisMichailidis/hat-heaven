// Dedicated for publishing events

import nats from "node-nats-streaming";
import { ProductCreatedPublisher } from "./events/product-created-publisher.js";
console.clear();

// Create a client to connect to the nats streaming server
/* We're registering a listener for the "connect" event, which the node-nats-streaming client will emit automatically once it's connected to the NATS Streaming server
   we're listening for the "connect" event that the library emits once the TCP/WebSocket connection is successfully established and the NATS handshake is complete.
*/
const client = nats.connect("hat-heaven", "abc", {
  url: "http://localhost:4222",
});

client.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new ProductCreatedPublisher(client);


  const data = {
    id: "123",
    title: "fedora hat",
    price: 20,
  };

  try {
    // that process is async. Handled that process manually in the Publisher
    await publisher.publish(data);
  } catch (err) {
    console.log(err)
  }
});
