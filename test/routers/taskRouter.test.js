const request = require('supertest');
const app = require('../../app.js');
const {initializeDBWithPopulatedList, initializeDBWithMultipleTasks, initializeDBWithMultipleLists, taskFixtureId} = require('../helpers/db-fixtures');
const mongoose = require('mongoose');

describe('task router', () => {

    describe('GET /api/tasks', () => {
        beforeEach(async() => {
            await initializeDBWithPopulatedList();
        });
        test("Should be able to fetch all existing tasks", async () => {
            const res = await request(app).get('/api/tasks').send().expect(200);
            expect(res.body).toEqual([
                {
                    _id: expect.anything(),
                    name: 'Task1',
                    description: 'sample description',
                    deadline: expect.anything(),
                    state: 'ONGOING',
                    __v: 0
                }
            ]);
        });
    });

    describe('GET /api/task/:id', () => {
        beforeEach(async() => {
            await initializeDBWithPopulatedList();
        });
        test("Should be able to fetch task by id", async () => {
            const res = await request(app).get(`/api/task/${taskFixtureId}`).send().expect(200);
            expect(res.body).toEqual(
                {
                    _id: String(taskFixtureId),
                    name: 'Task1',
                    description: 'sample description',
                    deadline: expect.anything(),
                    state: 'ONGOING',
                    __v: 0
                }
            );
        });
    });

    describe('PATCH /api/task/update/:id', () => {

        beforeEach(async() => {
            await initializeDBWithPopulatedList();
        });

        test("Should be able to update an existing task using the task _id", async () => {
            const res = await request(app).patch(`/api/task/update/${taskFixtureId}`).send({
                name: 'updated-name',
                description: 'updated description',
                deadline: '1999-01-01'
            }).expect(200);
            expect(res.body.name).toBe('updated-name');
            expect(res.body.description).toBe('updated description');
        });

        test("Should reject with 404 if task id does not exist", async () => {
            const randomTaskId = new mongoose.Types.ObjectId();
            await request(app).patch(`/api/task/update/${randomTaskId}`).send().expect(404);
        });

        test("Should reject with 500 if task id is not a valid ObjectId", async()=>{
            await request(app).patch('/api/task/update/notavalidobjectid').send().expect(500);
        });
    });

    describe('PATCH /api/task/complete/:id', () => {
        const originalConsoleLog = console.log;
        beforeEach(async()=>{
            delete console.log;
            console = {
                log: jest.fn()
            }
            await initializeDBWithPopulatedList();
        });

        afterAll(()=>{
            console.log = originalConsoleLog;
        });

        test("Should be able to change the task state to DONE", async () => {
            const res = await request(app).patch(`/api/task/complete/${taskFixtureId}`).send().expect(200);
            expect(res.body.state).toBe('DONE');
        });
        test("Should send mock email when task state is set to DONE", async () => {
            const res = await request(app).patch(`/api/task/complete/${taskFixtureId}`).send().expect(200);
            expect(res.body.state).toBe('DONE');
            expect(console.log).lastCalledWith(`[EMAIL SENT][${taskFixtureId}] Task1 task COMPLETED!`)
        });
    });

    describe('DELETE /api/task/:id', () => {
        beforeEach(async()=>{
            await initializeDBWithPopulatedList();
        });
        test("Should be able to delete a task using the task id", async () => {
            const res = await request(app).delete(`/api/task/${taskFixtureId}`).send().expect(200);
            expect(res.body).toEqual({
                _id: String(taskFixtureId),
                name: 'Task1',
                description: 'sample description',
                deadline: expect.anything(),
                state: 'ONGOING',
                __v: 0
            });
        });
    });

    describe('DELETE /api/tasks', () => {
        let arrayOfObjectIds = [];

        beforeEach(async()=>{
            for(let i = 0; i < 4; ++i){
                arrayOfObjectIds.push(String(mongoose.Types.ObjectId()).split('"')[0]);
            };
            await initializeDBWithMultipleTasks(arrayOfObjectIds);
        });
        test("Should be able to delete tasks specified in the req.body.tasks", async()=>{
            const res = await request(app).delete('/api/tasks').send({
                tasks: [...arrayOfObjectIds]
            }).expect(200);
            expect(res.body).toEqual({tasksDeleted: arrayOfObjectIds});
        });

        test("Should respond with message 'no tasks to delete' when req.body.tasks is empty", async()=>{
            const res = await request(app).delete('/api/tasks').send({
                tasks: []
            }).expect(400);
            expect(res.body.message).toBe('no tasks to delete!');
        });
    });

    describe('POST /api/task/move', () => {
        let dbInfo;
        beforeEach(async()=>{
            dbInfo = await initializeDBWithMultipleLists(2, 2);
        });
        test("Should be able to move multiple tasks to other lists", async()=>{
            const res = await request(app).post('/api/task/move').send({
                tasks: dbInfo[0].tasks,
                destination: dbInfo[1].listName
            }).expect(200);
            expect(res.body).toEqual({
                tasksMoved: dbInfo[0].tasks,
                listsUpdated: ['List0', 'List1']
            });
        });
        test("Should be able to move a single task to other lists", async()=>{
            const res = await request(app).post('/api/task/move').send({
                tasks: [dbInfo[0].tasks[0]],
                destination: dbInfo[1].listName
            }).expect(200);
            expect(res.body).toEqual({
                tasksMoved: [dbInfo[0].tasks[0]],
                listsUpdated: ['List0', 'List1']
            });
        });
    });
});