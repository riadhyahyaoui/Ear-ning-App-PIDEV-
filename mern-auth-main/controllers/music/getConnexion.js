const {MongoClient} = require('mongodb');

let db ; 
MongoClient.connect('mongodb://localhost:27017/mern',{
    useUnifiedTopology:true
},(err,client)=>{
    if(err){
        console.log(err);
        process.exit(0);
    }
   db= client.db('mern');
});

const getConnection= () => db ; 


module.exports = {
    getConnection
}