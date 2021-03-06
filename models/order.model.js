let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let orderSchema = new Schema({
    id:{
        type:Number,
        unique:true,
        index:true,
        required:" please fill in an id"
    },
    customer_id:{
        type: Number,
        index: true,
        required: "Please fill in a customer id",
    },
    state:{
        type: String,
        lowercase: true,
        required: "Please fill in a  state",
    },
    total:{
        type: Number,
        required: "Please fill in a total"
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Order',orderSchema);