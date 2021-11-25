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
};

const sampleEmptyListFixture = {
    _id: listFixtureId,
    name: 'List1'
};

const sampleListFixtureWithTask = {
    _id: listFixtureId,
    name: 'List2',
    tasks: [taskFixtureId]
};

const composeTaskFixture = (taskId, listId) => {
    return {
        _id: taskId,
        name: `task${String(taskId)}`,
        description: 'sample description',
        deadline: '01/01/2021',
        listLocation: listId
    }
};

const initializeEmptyDB = async () => {
    await List.deleteMany({});
    await Task.deleteMany({});
};

const initializeDBWithPopulatedList = async () => {
    await initializeEmptyDB();
    await new Task(sampleTaskFixture).save();
    await new List(sampleListFixtureWithTask).save();
};

const initializeDBWithEmptyList = async () => {
    await initializeEmptyDB();
    await new List(sampleEmptyListFixture).save();
};

const initializeDBWithMultipleTasks = async (taskIdArray) => {
    await initializeEmptyDB();
    await taskIdArray.forEach(async(taskId)=>{
        await new Task(composeTaskFixture(taskId, listFixtureId)).save();
    });
    const list = await new List(sampleEmptyListFixture);
    list.tasks = taskIdArray;
    await list.save();
};

const initializeDBWithMultipleLists = async (numberOfLists, tasksPerList) => {
    await initializeEmptyDB();
    const dbInfo = [];
    for(let i = 0; i < numberOfLists; i++){
        let taskIds = []
        const listId = mongoose.Types.ObjectId();
        for(let j=0; j < tasksPerList; j++){
            const taskId = mongoose.Types.ObjectId();
            taskIds.push(String(taskId).split('"')[0]);
            await new Task(composeTaskFixture(taskId, listId)).save();
        }
        await new List({
            _id: listId,
            name: `List${i}`,
            tasks: taskIds
        }).save();
        dbInfo.push({listName: `List${i}`, tasks: taskIds})
    }
    return dbInfo;
}

module.exports = {
    initializeEmptyDB,
    initializeDBWithEmptyList,
    initializeDBWithPopulatedList,
    initializeDBWithMultipleTasks,
    initializeDBWithMultipleLists,
    taskFixtureId,

}