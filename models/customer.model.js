let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let customSchema = new Schema({
    id:{
        type:Number,
        unique:true,
        index:true,
        required:" please fill in an id"
    },
    name:{
        type: String,
        lowercase: true,
        required: "Please fill in a name",
        trim: true
    },
    credit_limit:{
        type: Number,
        required: "Please fill in a credit_limit"
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer',customSchema);