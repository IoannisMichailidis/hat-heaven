import { Listener, subjects } from "@hat-heaven/common";
import { Product } from '../../models/productModel.js';
import { queueGroupName } from "./queue-group-name.js";

export class ProductUpdatedListener extends Listener {
  constructor(client) {
    super(client, subjects.ProductUpdated, queueGroupName);
  }

  // Function to run when a message is received
  async onMessage(data, msg) {
    console.log("Event Data! ", data);
    // Add the business logic here for the specific orders microservice
    const { id, price, name, version } = data;

    // Search for the version -1 to make sure that we will keep correct concurrency of events
    // when the product is found and processed then mongoose will automatically incriment the version
    const product = await Product.findOne({
      _id: id,
      version: version - 1
    });

    // if th eproduct is not found then the NAT will send the event again later
    if (!product) {
        throw new Error('Product not found');
    }

    // Update product
    product.name = name;
    product.price = price;
    
    // Update the db of the orders microservice
    // mongoose will automatically incriment the version
    await product.save();

    // when process is successful, manually acknowledge the event so the server wont send it again
    msg.ack();        
    
  }  
}
