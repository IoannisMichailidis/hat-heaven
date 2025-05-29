// Dedicated for listening for events
import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { ProductCreatedListener } from "./events/product-created-listener.js";

console.clear();

/*
Specify a subject/channel name
pass that to the client to create the subscription
Then we will are going to watch the subscription for anytime that receives some data
*/

const client = nats.connect("hat-heaven", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("Listener connected to NATS");

  // solve the following issue = > There is a period of time after we kill a listener that the NATS server thinks that the client still might be active
  client.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new ProductCreatedListener(client).listen();
});

// make sure we emit the close event of the client when any of those happens in terminal
process.on("SIGINT", () => client.close()); // rs to restart the listener in our terminal
process.on("SIGTERM", () => client.close()); // ctrl c in our terminal
