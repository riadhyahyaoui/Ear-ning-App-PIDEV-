const mongoose =require ("mongoose");

const lyricsSchema = mongoose.Schema({
    description: {type:String},
    name:{type:String},
    lyrics:{type:String}
});
const lyrics = mongoose.model("lyrics", lyricsSchema);
module.exports = lyrics;
