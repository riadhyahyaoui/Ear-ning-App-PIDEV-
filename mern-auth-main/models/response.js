const mongoose = require("mongoose");

const reponseSchema = new mongoose.Schema(
    {
      reponse: { type: String, required: true },
      idComment: { type: String, required: false },
    },
    { timestamps: true }
  );
  //generate model
const Reponse = mongoose.model("Reponse", reponseSchema);

//export model
module.exports = Reponse;