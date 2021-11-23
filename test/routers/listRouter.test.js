const request = require('supertest');
const app = require('../../app.js');
const {initializeEmptyDB, initializeDBWithEmptyList} = require('../helpers/db-fixtures');

describe('list router', () => {
    
    afterAll(async()=>{
        await initializeEmptyDB();
    });

    describe('POST /api/list', () => {
        const route = '/api/list';
        let req;
        beforeEach(async () => {
            await initializeEmptyDB();
            req = {
                body: {
                    name: 'test-list'
                }
            };
        });
        test("Should be able to create a new list with the name from request", async ()=>{
            const res = await request(app).post(route).send(req.body).expect(201);
            expect(res.body.name).toBe(req.body.name);
        });
        test("Should return status 500 when request body doesn't have name", async ()=>{
            delete req.body.name;
            await request(app).post(route).send(req.body).expect(500);
        });
    });

    describe('GET /api/lists', () => {
        const route = '/api/lists';
        beforeEach(async () => {
            await initializeDBWithEmptyList();
        });
        test("Should be able to fetch existing lists in the DB", async () => {
            const res = await request(app).get(route).send().expect(200);
            expect(res.body[0].name).toEqual('List1');
        });
    });

    describe('GET /api/list/:name', () => {
        beforeEach(async () => {
            await initializeDBWithEmptyList();
        });
        test("Should be able to fetch the list using the name in the query param", async () => {
            const res = await request(app).get('/api/list/List1').send().expect(200);
            expect(res.body.name).toEqual('List1');
        });
    });

    describe('POST /api/list/:name/task', () => {
        let route = '/api/list/List1/task';
        beforeEach(async () => {
            await initializeDBWithEmptyList();
        });
        test("Should be able to add a task to existing list", async () => {
            const res = await request(app).post(route).send({
                name: 'new-task',
                description: 'sample description',
                deadline: '2021-01-01'
            }).expect(201);
            expect(res.body.tasks[0]).toEqual(expect.objectContaining({
                name:'new-task',
                description: 'sample description'
            }));
        });
        test("Should respond with 404 when queried list doesn't exist", async () => {
            route = '/api/list/INVALIDLISTNAME/task'
            const res = await request(app).post(route).send({
                name: 'new-task',
                description: 'sample description',
                deadline: '2021-01-01'
            }).expect(404);
            expect(res.body).toEqual({
                message: 'list \'INVALIDLISTNAME\' not found!'
            });
        });
    })
})