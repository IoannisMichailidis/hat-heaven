import { Listener, subjects } from "@hat-heaven/common";
import { Product } from "../../models/productModel.js";
import { queueGroupName } from "./queue-group-name.js";

export class ProductCreatedListener extends Listener {
  constructor(client) {
    super(client, subjects.ProductCreated, queueGroupName);
  }

  // Function to run when a message is received
  async onMessage(data, msg) {
    console.log("Event Data! ", data);

    const { id, price, name } = data;

    const product = await new Product({
      _id: id,
      name: name,
      price: price,
    });

    // Update the db of the orders microservice
    await product.save();

    // when process is successful, manually acknowledge the event so the server wont send it again
    msg.ack();
  }
}
