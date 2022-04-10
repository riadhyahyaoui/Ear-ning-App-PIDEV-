const mongoose =require ("mongoose");

const chatBoxSchema = mongoose.Schema({
    idUserSource: { type: String},
    idUserDestination: {type:String},
    content: {type:String,required:true},
    dateEnvoi: {type:Date,default:Date.now()},
    sourdine: {type:Boolean,default:false},
});
const chatBox = mongoose.model("chatBox", chatBoxSchema);
module.exports = chatBox;
