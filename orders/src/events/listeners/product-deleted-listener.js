import { Listener, subjects } from "@hat-heaven/common";
import { Product } from '../../models/productModel.js';
import { queueGroupName } from "./queue-group-name.js";

export class ProductDeletedListener extends Listener {
  constructor(client) {
    super(client, subjects.ProductDeleted, queueGroupName);
  }

  // Function to run when a message is received
  async onMessage(data, msg) {
    console.log("Event Data! ", data);
    // Add the business logic here for the specific orders microservice
    const { id } = data;

    const product = await Product.findById(id);

    if (!product) {
        throw new Error('Product not found');
    }

    // Delete product from db
    await Product.deleteOne({_id: product._id});

    // when process is successful, manually acknowledge the event so the server wont send it again
    msg.ack();
  }  
}
