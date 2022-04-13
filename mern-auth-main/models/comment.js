const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    commentaire: { type: String, required: true },
    numReponses: { type: String, required: false },
    music: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Music",
      required: true,
    },
    reponses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Response",
      },
    ],
    postedby: { type: String, required: false, ref: "user" },
    likes: { type: Number, required: false },
    dislikes: { type: Number, required: false },
    usersLiked: { type: [String], required: false },
    usersDisliked: { type: [String], required: false },
  },

  { timestamps: true }
);
module.exports = mongoose.model("Comment", commentSchema);

