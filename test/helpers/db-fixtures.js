const List = require('../../db/models/lists-model');
const Task = require('../../db/models/tasks-model');
const mongoose = require('mongoose');

const listFixtureId = mongoose.Types.ObjectId();
const taskFixtureId = mongoose.Types.ObjectId();
const sampleTaskFixture = {
    _id: taskFixtureId,
    name: 'Task1',
    description: 'sample description',
    deadline: '01/01/2021'
}

const sampleEmptyListFixture = {
    _id: listFixtureId,
    name: 'List1'
}

const sampleListFixtureWithTask = {
    _id: listFixtureId,
    name: 'List2',
    tasks: [taskFixtureId]
}

const composeTaskFixture = (objectId) => {
    return {
        _id: objectId,
        name: `task${String(objectId)}`,
        description: 'sample description',
        deadline: '01/01/2021',
        listLocation: listFixtureId
    }
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

const initializeDBWithMultipleTasks = async (taskIdArray) => {
    await initializeEmptyDB();
    await taskIdArray.forEach(async(taskId)=>{
        await new Task(composeTaskFixture(taskId)).save();
    });
    const list = await new List(sampleEmptyListFixture);
    list.tasks = taskIdArray;
    await list.save();
};

module.exports = {
    initializeEmptyDB,
    initializeDBWithEmptyList,
    initializeDBWithPopulatedList,
    initializeDBWithMultipleTasks,
    taskFixtureId
}