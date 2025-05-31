import { Listener, subjects } from "@hat-heaven/common";
import { User } from "../../models/userModel.js";
import { queueGroupName } from "./queue-group-name.js";

export class UserCreatedListener extends Listener {
  constructor(client) {
    super(client, subjects.UserCreated, queueGroupName);
  }

  // Function to run when a message is received
  async onMessage(data, msg) {
    console.log("Event Data! ", data);
    // Add the business logic here for the specific orders microservice
    const { id, name, email, isAdmin } = data;

    const user = new User({
      _id: id,
      name: name,
      email: email,
      isAdmin,
      isAdmin,
    });

    // Update the db of the orders microservice
    await user.save();

    // when process is successful, manually acknowledge the event so the server wont send it again
    msg.ack();
  }
}
