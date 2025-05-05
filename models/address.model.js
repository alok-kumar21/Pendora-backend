const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    mobilenumber:{
        type:Number,
        require:true,
        
    },
    pincode:{
        type:Number,
        require:true
    },
    locality:{
        type:String,
        require:true,
    },
    address:{
        type:String,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    state:{
        type:String,
        require:true
    },
    landmark:{
        type:String,
        require:true,
    }

},{timestamps:true})


const Address = mongoose.model("Address",addressSchema)

module.exports = Address