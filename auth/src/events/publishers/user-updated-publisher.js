import { Publisher, subjects } from "@hat-heaven/common";

export class UserUpdatedPublisher extends Publisher {
  constructor(client) {
    super(client, subjects.UserUpdated);
  }
}
