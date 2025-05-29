import { Publisher, subjects } from "@hat-heaven/common";

export class ProductUpdatedPublisher extends Publisher {
  constructor(client) {
    super(client, subjects.ProductUpdated);
  }
}
