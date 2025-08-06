import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      verify: false,
    },
    phone: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    aboutMe: {
      type: String,
      default: "Hey there I am using Whatsapp",
    },
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export { User };
