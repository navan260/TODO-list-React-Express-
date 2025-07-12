import mongoose from "mongoose";
import userSchema from "../schema/userSchema.js";

const user = mongoose.model("User", userSchema);

export default user;