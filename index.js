const PORT = process.env.PORT || 4000;
const app = require('./app');
const Task = require('./db/models/tasks-model');
const moment = require('moment');
const _ = require('lodash');

app.listen(PORT, ()=>{
    console.log(`app listening on port: ${PORT}`)
});

const checkNewDueTasks = async () => {
    const now = moment().format('YYYY-MM-DD');
    const tasksPreviouslyDue = await Task.find({state: 'DUE'});
    const idListOfTasksAlreadyDue = tasksPreviouslyDue.map((task)=>String(task._id).split('"')[0]);
    await Task.updateMany(
        {
            state: 'ONGOING',
            deadline: { $lte: now }
        }, 
        {state: 'DUE'}
    ).exec( async()=>{
        const tasksNowDue = await Task.find({state: 'DUE'});
        const idListOfTasksNowDue = tasksNowDue.map((task)=>String(task._id).split('"')[0]);
        const newDueTasks = _.difference(idListOfTasksNowDue, idListOfTasksAlreadyDue);
        newDueTasks.forEach((taskID)=>{
            console.log(`[EMAIL SENT] Task ${taskID} is now due!`)
        });
    });
};

//chron job for updating state of due ONGOING tasks
setInterval(async ()=>{
    await checkNewDueTasks();
},process.env.INTERVAL || 10000);
