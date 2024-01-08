// Check objectId in mongo DB
// Check for Mongoose bad ObjectId
import { isValidObjectId } from "mongoose";

function checkObjectId(req, res, next) {
    if (!isValidObjectId(req.params.id)) { // req.params.id = product id
        res.status(404);
        throw new Error(`Invalid ObjectId of: ${req.params.id}`);
    }
    next();
}

export default checkObjectId;