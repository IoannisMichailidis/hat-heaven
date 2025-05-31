import { Listener, subjects } from "@hat-heaven/common";
import { queueGroupName } from "./queue-group-name.js";
import { User } from "../../models/userModel.js";

export class UserUpdatedListener extends Listener {
  constructor(client) {
    super(client, subjects.UserUpdated, queueGroupName);
  }

  // Function to run when a message is received
  async onMessage(data, msg) {
    console.log("Event Data! ", data);
    // Add the business logic here for the specific orders microservice
    const { id, name, email, isAdmin, version } = data;

    // Search for the version -1 to make sure that we will keep correct concurrency of events
    // when the product is found and processed then mongoose will automatically incriment the version
    const user = await User.findOne({
      _id: id,
      version: version - 1,
    });

    // if th eproduct is not found then the NAT will send the event again later
    if (!user) {
      throw new Error("User not found");
    }

    // Update product
    user.name = name;
    user.email = email;
    user.isAdmin = isAdmin;

    // Update the db of the orders microservice
    // mongoose will automatically incriment the version
    await user.save();

    // when process is successful, manually acknowledge the event so the server wont send it again
    msg.ack();
  }
}
