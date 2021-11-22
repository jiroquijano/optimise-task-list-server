const List = require('../../db/models/lists-model');
const Task = require('../../db/models/tasks-model');
const mongoose = require('mongoose');

const taskFixtureId = mongoose.Types.ObjectId();
const sampleTaskFixture = {
    _id: taskFixtureId,
    name: 'Task1',
    description: 'sample description',
    deadline: '01/01/2021'
}

const sampleEmptyListFixture = {
    _id: mongoose.Types.ObjectId(),
    name: 'List1'
}

const initializeEmptyDB = async () => {
    await List.deleteMany({});
    await Task.deleteMany({});
}

const initializeDBWithEmptyList = async () => {
    await List.deleteMany({});
    await Task.deleteMany({});
    await new Task(sampleTaskFixture).save();
    await new List(sampleEmptyListFixture).save();
}

module.exports = {
    initializeEmptyDB,
    initializeDBWithEmptyList
}