const mongoose =require ("mongoose");

const musiqueSchema = mongoose.Schema({
    description: {type:String},
    name:{type:String},
    dateCreation: {type:Date,default:Date.now()},
    image: {type: String,default: 'placeholder.jpg'},
    musique:{type:Number}
});
const musique = mongoose.model("musique", musiqueSchema);
module.exports = musique;
