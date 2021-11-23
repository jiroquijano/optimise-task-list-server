const request = require('supertest');
const app = require('../../app.js');
const {initializeEmptyDB, initializeDBWithPopulatedList, taskFixtureId} = require('../helpers/db-fixtures');
const mongoose = require('mongoose');

describe('task router', () => {

    describe('PATCH /api/task/:id', () => {

        beforeEach(async() => {
            await initializeDBWithPopulatedList();
        });

        test("Should be able to update an existing task using the task _id", async () => {
            const res = await request(app).patch(`/api/task/${taskFixtureId}`).send({
                name: 'updated-name',
                description: 'updated description',
                deadline: '1999-01-01'
            }).expect(200);
            expect(res.body).toEqual(expect.objectContaining({
                name: 'updated-name',
                description: 'updated description'
            }))
        });

        test("Should reject with 404 if task id does not exist", async () => {
            const randomTaskId = new mongoose.Types.ObjectId();
            await request(app).patch(`/api/task/${randomTaskId}`).send().expect(404);
        });

        test("Should reject with 500 if task id is not a valid ObjectId", async()=>{
            await request(app).patch('/api/task/notavalidobjectid').send().expect(500);
        });
    });

    describe('PATCH /api/task/:id/complete', () => {
        beforeEach(async()=>{
            await initializeDBWithPopulatedList();
        });

        test("Should be able to change the task state to DONE", async () => {
            const res = await request(app).patch(`/api/task/${taskFixtureId}/complete`).send().expect(200);
            expect(res.body.state).toBe('DONE');
        });
    });
});