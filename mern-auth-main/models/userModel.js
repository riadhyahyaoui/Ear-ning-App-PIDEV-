const mongoose = require("mongoose");
const { isEmail } = require('validator');
var bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    
    role:{
        type: String,
        enum: ['superadmin','admin','user'],
        required: true
    },
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    gender: {
      type: String,
      default: "male",
    },
    mobile: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    secretToken: {
      type: String
    },
    Isactive: {
      type: Boolean
    },
    banned: {
      type: Boolean,default:false
    },
    Passwordtoken:{
      type:String
    },
    followers: [
      { type: Schema.Types.ObjectId, ref: "user" }
    ],
    following: [
      { type: Schema.Types.ObjectId, ref: "user" }],

  PasswordResetDate: {
      type:Date
  }

  },
  {
    timestamps: true,
  }
);
userSchema.methods.isValidPassword = async function (newPass) {
  try {

      return await bcrypt.compare(newPass, this.password)

  } catch (error) {
      throw new Error(error);
  }
}

module.exports = mongoose.model("user", userSchema);
