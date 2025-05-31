import  mongoose  from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Create the product Schema
const productSchema = new mongoose.Schema({
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: "User", // That comes from the User collection. So, I associate
    // },
    price: {
        type: Number,
        required: true,
        default: 0,
    },  
}, {
    timestamps: true // automatically adds the created timestamp field
});

// Wire up updateIfCurrentPlugin to schema to use the version (Optimistic Concurrency Control implementation)
productSchema.set('versionKey', 'version') // convert the __v default property to version
productSchema.plugin(updateIfCurrentPlugin)

// Create the model and relate it to the Schema
export const Product = mongoose.model("Product", productSchema);