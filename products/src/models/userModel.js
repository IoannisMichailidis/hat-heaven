import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// Create the user Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    timestamps: true, // automatically adds the created timestamp field
  }
);

// Wire up updateIfCurrentPlugin to schema to use the version (Optimistic Concurrency Control implementation)
userSchema.set("versionKey", "version"); // convert the __v default property to version
userSchema.plugin(updateIfCurrentPlugin);

// Create the model and relate it to the Schema
// Model concept is how we actually access data in mongo db
export const User = mongoose.model("User", userSchema);
