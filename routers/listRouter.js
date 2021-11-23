const express = require('express');
const List = require('../db/models/lists-model');
const Task = require('../db/models/tasks-model');
const router = new express.Router();
const _ = require('lodash');
const mongoose = require('mongoose');

//Creates a new list
//  req.body = {
//      "name": String
//  }
router.post('/api/list', async(req,res)=>{
    const newList = new List({name: req.body.name});
    try{
        await newList.save();
        res.status(201).send(newList);
    }catch(error){
        console.log(error.message);
        res.status(500).send({error:error.message});
    }
});

//Gets all available lists
router.get('/api/lists', async(req,res)=>{
    try{
        const allLists = await List.find({}).populate('tasks');
        res.status(200).send(allLists);
    }catch(error){
        console.log(error.message);
        res.status(500).send({error:error.message});
    }
});

//Gets a specific list
router.get('/api/list/:name', async(req,res)=>{
    try {
        const list = await List.findOne({name: req.params.name}).populate('tasks');
        if(!list) return res.status(400).send({message: `list '${req.params.name}' not found`});
        res.status(200).send(list);
    }catch(error){
        console.log(error.message);
        res.status(500).send({error:error.message});
    }
})

//Creates a task under a specific list
// req.body = {
//  "name": String,
//  "description": String,
//  "deadline": Date
//  }
router.post('/api/list/:name/newtask', async (req,res)=>{
    try {
        //check first if list with specific name exists
        const list = await List.findOne({name: req.params.name}).populate('tasks');
        if(!list) return res.status(404).send({message: `list '${req.params.name}' not found!`});
        //if list exists create new task
        const newTask = new Task({
            name: req.body.name,
            description: req.body.description,
            deadline: req.body.deadline, 
            listLocation: list._id //assign fetched list id as task's list location
        });
        await newTask.save();
        //add to list and save
        list.tasks.push(newTask._id);
        await list.save();
        const updatedList = await List.findOne({name: req.params.name}).populate('tasks'); //fetch updated list
        res.status(201).send(updatedList);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error:error.message});
    }
});

//Deletes a list and its tasks
router.delete('/api/list/:name', async(req,res)=>{
    try {
        const list = await List.findOne({name: req.params.name}).populate('tasks');
        if(!list) return res.status(404).send({message: `list '${req.params.name}' not found!`});
        await Task.deleteMany({listLocation: list._id});
        const listCopy = _.cloneDeep(list);
        await List.deleteOne({_id: list._id});
        res.status(200).send(listCopy);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error:error.message});
    }
})


module.exports = router;