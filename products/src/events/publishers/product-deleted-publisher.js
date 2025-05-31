import { Publisher, subjects } from "@hat-heaven/common";

export class ProductDeletedPublisher extends Publisher {
  constructor(client) {
    super(client, subjects.ProductDeleted);
  }
}