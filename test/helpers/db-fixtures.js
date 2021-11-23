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

const sampleListFixtureWithTask = {
    _id: mongoose.Types.ObjectId(),
    name: 'List2',
    tasks: [taskFixtureId]
}


const initializeEmptyDB = async () => {
    await List.deleteMany({});
    await Task.deleteMany({});
}

const initializeDBWithPopulatedList = async () => {
    await initializeEmptyDB();
    await new Task(sampleTaskFixture).save();
    await new List(sampleListFixtureWithTask).save();
}

const initializeDBWithEmptyList = async () => {
    await initializeEmptyDB();
    await new List(sampleEmptyListFixture).save();
}

module.exports = {
    initializeEmptyDB,
    initializeDBWithEmptyList,
    initializeDBWithPopulatedList,
    taskFixtureId
}