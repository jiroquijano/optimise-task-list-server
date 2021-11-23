const PORT = process.env.PORT || 4000;
const app = require('./app');
const {checkNewDueTasks} = require('./utils/chron-jobs');

app.listen(PORT, ()=>{
    console.log(`app listening on port: ${PORT}`)
});

//chron job for updating state of due ONGOING tasks
setInterval(async ()=>{
    checkNewDueTasks();
},process.env.CHECK_DUE_INTERVAL || 10000);


