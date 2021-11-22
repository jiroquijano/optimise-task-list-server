const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
});


const List = mongoose.model('List',listSchema);
module.exports = List;
