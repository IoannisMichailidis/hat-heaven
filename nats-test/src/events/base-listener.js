import nats from "node-nats-streaming";

export class Listener {
  // Simulating abstract class behavior
  // It makes it clear which methods/properties must be implemented by subclasses.
  // Will will throw an error if the subclasses won't comply with those rules
  /*
  Eg.
  class MyListener extends Listener {}
  const l = new MyListener(client);
  l.listen(); // Will throw obscure runtime errors because onMessage is not defined
  */
  constructor(client, subject, queueGroupName) {
    if (this.constructor === Listener) {
      throw new Error("Cannot instantiate abstract class Listener directly.");
    }

    this.client = client;
    this.ackWait = 5 * 1000;
    this.subject = subject;
    this.queueGroupName = queueGroupName;

    if (!this.subject) {
      throw new Error("Listener subclass must define subject");
    }

    if (!this.queueGroupName) {
      throw new Error("Listener subclass must define queueGroupName");
    }

    if (typeof this.onMessage !== "function") {
      throw new Error("Listener subclass must implement onMessage method");
    }
  }

  // Default subscription options
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // Get all the Events from Event History when the service created for first time
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName); // Get only those events that haven't been sent to the service from the Event History
  }

  // Code to set up the subscription
  listen() {
    // Create a subscription which listen to the very specific channel
    // make also that listener part of a queque group in the specific channel
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  // Helper function to parse a message
  parseMessage(msg) {
    const data = msg.getData();
    // data comes as string or buffer
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
