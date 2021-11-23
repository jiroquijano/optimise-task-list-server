const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    listLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    deadline: {
        type: Date,
        required: false
    },
    state: {
        type: String,
        enum: ['ONGOING', 'DONE'],
        default: 'ONGOING',
    }
});

const Task = mongoose.model('Task',taskSchema);
module.exports = Task;
