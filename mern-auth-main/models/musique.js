const mongoose =require ("mongoose");

const musiqueSchema = mongoose.Schema({
    description: {type:String},
    name:{type:String},
    dateCreation: {type:Date,default:Date.now()},
    artist:{type:String},
    views:{type:Number},
    likes:{type:Number},
    dislikes:{type:Number},
    Duration:{type:Number},
    image: {type: String,default: 'placeholder.jpg'},
});
const musique = mongoose.model("musique", musiqueSchema);
module.exports = musique;
