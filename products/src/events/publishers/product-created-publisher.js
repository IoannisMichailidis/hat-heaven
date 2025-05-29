import { Publisher, subjects } from "@hat-heaven/common";

export class ProductCreatedPublisher extends Publisher {
  constructor(client) {
    super(client, subjects.ProductCreated);
  }
}
