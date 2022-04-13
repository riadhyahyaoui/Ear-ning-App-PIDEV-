const mongoose =require ("mongoose");
const object ={
    USER : 'USER',
    APP : 'APP'
  }

const reclamationSchema = mongoose.Schema({
    object: {type: String,default:"RECLAMATION !!"}, 
    idUserSource: { type: String,require:true},
    idUserDestination: {type:String,ref: "user"},
    type :{type:String,enum:object,default:object.APP,required: true},
    content: {type:String,required:true},
    dateEnvoi: {type:Date,default:Date.now()},
    isDone: {type: Boolean , default:false}
});
const reclamation = mongoose.model("reclamation", reclamationSchema);
module.exports = reclamation;
