require('./db/mongoose');
const express = require('express');
const app = express();
const listRouter = require('./routers/listRouter');

app.use(express.json());
app.use(listRouter);

module.exports = app;