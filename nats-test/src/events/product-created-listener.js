import { Listener } from "./base-listener.js";
import { subjects } from "./subjects.js";

// Eg. This listener will be created inside the orders service to listen for product created updates
export class ProductCreatedListener extends Listener {
  constructor(client) {
    super(client, subjects.ProductCreated, "orders-service");
  }

  // Function to run when a message is received
  onMessage(data, msg) {
    console.log("Event Data! ", data);
    // Add the business logic here for the specific orders microservice
    // Update the db of the orders microservice

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);
    // if all good
    // manually acknowledge the event so the server wont send it again
    msg.ack();
  }
}
