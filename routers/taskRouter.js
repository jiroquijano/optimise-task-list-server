const express = require('express');
const Task = require('../db/models/tasks-model');
const router = new express.Router();
const {updateTaskRequestWhiteList} = require('../utils/utilities');

//Updates a task
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
        console.log(`[EMAIL SENT][${task._id}] ${task.name} task COMPLETED!`)
        res.status(200).send(task);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error:error.message});
    }
});

module.exports = router;