import { Publisher, subjects } from "@hat-heaven/common";

export class UserDeletedPublisher extends Publisher {
  constructor(client) {
    super(client, subjects.UserDeleted);
  }
}