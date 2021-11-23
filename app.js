require('./db/mongoose');
const express = require('express');
const app = express();
const listRouter = require('./routers/listRouter');
const taskRouter = require('./routers/taskRouter');

app.use(express.json());
app.use(listRouter);
app.use(taskRouter);

module.exports = app;