const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instructor = new Schema({
    name : String,
    rating : Number,
    auther : {
        type : Schema.Types.ObjectId,
        ref : 'User',
    }
})
module.exports =mongoose.model('Review',reviewSchema)