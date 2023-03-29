const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 8000;

const app = express();


app.use('/api/urls', require('./routes/urlRoutes'));


app.listen(port, () => console.log(`Currently listening on port ${port}`));


