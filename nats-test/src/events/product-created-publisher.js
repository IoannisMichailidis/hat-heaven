import { Publisher } from "./base-publisher.js";
import { subjects } from "./subjects.js";

export class ProductCreatedPublisher extends Publisher {
  constructor(client) {
    super(client, subjects.ProductCreated);
  }
}
