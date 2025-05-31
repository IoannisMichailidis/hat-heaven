import { natsWrapper } from "./nats-wrapper.js";
import {
  ProductCreatedListener,
  ProductUpdatedListener,
  ProductDeletedListener,
  UserCreatedListener,
  UserUpdatedListener,
  UserDeletedListener,
} from "../events/listeners/listeners.js";

export const connectNATS = async (natsClusterId, natsClientId, natsURL) => {
  try {
    await natsWrapper.connect(natsClusterId, natsClientId, natsURL); // nats-srv is the serves we created for nats on kubernetes

    // solve the following issue = > There is a period of time after we kill a listener that the NATS server thinks that the client still might be active
    // I don't want to include that event to the NatsWrapper class because it can exit the process and I don't want to hide such a functionality in a class
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    // make sure we emit the close event of the client when any of those happens in terminal
    process.on("SIGINT", () => natsWrapper.client.close()); // rs to restart the listener in our terminal
    process.on("SIGTERM", () => natsWrapper.client.close()); // ctrl c in our terminal

    // Listen to Channels/Events
    new ProductCreatedListener(natsWrapper.client).listen();
    new ProductUpdatedListener(natsWrapper.client).listen();
    new ProductDeletedListener(natsWrapper.client).listen();

    new UserCreatedListener(natsWrapper.client).listen();
    new UserUpdatedListener(natsWrapper.client).listen();
    new UserDeletedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};
