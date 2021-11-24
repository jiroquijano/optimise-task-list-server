const express = require('express');
const Task = require('../db/models/tasks-model');
const router = new express.Router();
const {updateTaskRequestWhiteList} = require('../utils/utilities');
const _ = require('lodash');
const List = require('../db/models/lists-model');

//Gets all existing tasks
router.get('/api/tasks', async (req,res) => {
    try {
        const allTasks = await Task.find({});
        res.status(200).send(allTasks);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error:error.message});
    }
});

//Gets specific task through id
router.get('/api/task/:id', async(req,res)=>{
    try {
        const task = await Task.findOne({_id: req.params.id});
        if(!task) return res.status(404).send({message: `task '${req.params.id}' not found`});
        res.status(200).send(task);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error:error.message});
    }
});

//Updates a task
// req.body = {
//  "name": String,
//  "description": String,
//  "deadline": Date
//  }
router.patch('/api/task/update/:id', async (req,res) => {
    try {
        //trim the request and only get allowed fields to update
        const allowedModifications = updateTaskRequestWhiteList(req.body);
        //check if task exists 
        const task = await Task.findOne({_id: req.params.id});
        if(!task) return res.status(404).send({error: `task not found`});
        //iterate through all of the whitelisted fields for modification
        allowedModifications.forEach((field) => {
            task[field] = req.body[field]
        });
        await task.save();
        res.status(200).send(task);    
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error:error.message});
    }
});

//Marks a task complete
router.patch('/api/task/complete/:id', async (req,res) => {
    try {
        const task = await Task.findOne({_id: req.params.id});
        if(!task) return res.status(404).send({error: `task not found`});
        if(task.state === 'DONE') return res.status(200).send(task);
        task.state = 'DONE';
        await task.save();
        //mock email sending through console.log
        console.log(`[EMAIL SENT][${task._id}] ${task.name} task COMPLETED!`);
        res.status(200).send(task);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error:error.message});
    }
});

//Deletes a task with id
router.delete('/api/task/:id', async (req,res) => {
    try {
        const task = await Task.findOne({_id: req.params.id});
        if(!task) return res.status(404).send({error: `task not found`});
        const taskCopy = _.cloneDeep(task);
        await Task.deleteOne({_id: req.params.id});
        res.status(200).send(taskCopy);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error:error.message});
    }
});

//Deletes multiple tasks
//  req.body = {
//      "tasks": Task ID []
//  }
router.delete('/api/tasks', async (req,res) => {
    try {
        if(_.isEmpty(req.body.tasks)) return res.status(200).send({message: 'no tasks to delete'});
        const deletedTasks = await Promise.all(req.body.tasks.map(async (taskID)=>{
            const task = await Task.findOne({_id: taskID});
            if(!task) return null;
            const list = await List.findOne({_id: task.listLocation});
            if(!list) return null;
            list.tasks.splice(list.tasks.indexOf(task._id), 1);
            await List.updateOne({_id: list._id},{tasks: list.tasks});
            const result = await Task.deleteOne({_id: taskID});
            if(result) return taskID;
        }));
        const tasksDeleted = deletedTasks.filter((task) => task);
        res.status(200).send({
            tasksDeleted
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error:error.message});
    }
});

module.exports = router;