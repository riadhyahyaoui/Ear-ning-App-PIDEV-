const mongoose =require ("mongoose");

const albumSchema = mongoose.Schema({
    description: {type:String},
    name:{type:String},
    dateCreation: {type:Date,default:Date.now()}
});
const album = mongoose.model("album", albumSchema);
module.exports = album;

const reclamationSchema = mongoose.Schema({
    object: {type: String,default:"RECLAMATION !!"}, 
    idUserSource: { type: String},
    idUserDestination: {type:String},
    type :{type:String,enum:object,default:object.APP,required: true},
    content: {type:String,required:true},
    dateEnvoi: {type:Date,default:Date.now()}
});
const reclamation = mongoose.model("reclamation", reclamationSchema);
 module.exports = reclamation;
