//connect to mongoose,access to mongoose class
let mongoose=require('mongoose');

//create a model class
let contactModel=mongoose.Schema({
    //property
    name:String,
    contactNum:Number,
    email:String
},{
    collection:"Contacts"
});

//export module;return the whole model,not just class
module.exports=mongoose.model('Contact',contactModel);
