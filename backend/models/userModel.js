import  mongoose  from "mongoose";
import bcrypt from 'bcryptjs';

// Create the user Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    isAdmin: {
        type: Boolean,
        require: true,
        default: false,
    },
}, {
    timestamps: true // automatically adds the created timestamp field
})

// add the matchPassword method that compares the password in the DB with the one the user provided
// Use that in the user controllers => user.matchPassword(enteredPassword)
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// add the password encryption functionality to the userSchema
// pre makes the method to run before the new user is saved in the db
userSchema.pre('save', async function (next) {
    // if the data we modify do not include the password then we move to th next mongoose middleware
    if (!this.isModified('password')) {
        next();
    }
    // Encrypt the user's password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})



// Create the model and relate it to the Schema
const User = mongoose.model("User", userSchema);

export default User;