require('./db/mongoose');
const express = require('express');
const app = express();
const listRouter = require('./routers/listRouter');
const taskRouter = require('./routers/taskRouter');
var cors = require('cors');


app.use(express.json());
app.use(cors());
app.use(listRouter);
app.use(taskRouter);

module.exports = app;