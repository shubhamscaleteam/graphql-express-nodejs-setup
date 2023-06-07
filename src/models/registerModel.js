import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RegiseterUser = new Schema({
  userName: {
    type: String,
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
  profilePicture: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const Register = mongoose.model("registerModel", RegiseterUser);
export default Register;
