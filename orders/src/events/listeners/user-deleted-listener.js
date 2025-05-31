import { Listener, subjects } from "@hat-heaven/common";
import { User } from "../../models/userModel.js";
import { queueGroupName } from "./queue-group-name.js";

export class UserDeletedListener extends Listener {
  constructor(client) {
    super(client, subjects.UserDeleted, queueGroupName);
  }

  // Function to run when a message is received
  async onMessage(data, msg) {
    console.log("Event Data! ", data);

    const { id } = data;

    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    // Delete user from db
    await User.deleteOne({ _id: user._id });

    // when process is successful, manually acknowledge the event so the server wont send it again
    msg.ack();
  }
}
