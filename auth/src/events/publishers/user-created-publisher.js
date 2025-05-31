import { Publisher, subjects } from "@hat-heaven/common";

export class UserCreatedPublisher extends Publisher {
  constructor(client) {
    super(client, subjects.UserCreated);
  }
}
