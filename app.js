const path = require('path');

const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const port = 8080;

const index = path.join(process.cwd(), 'static', 'index.html');
const notFound = path.join(process.cwd(), 'static', '404.html');

const blogRoutes = require('./routes/posts');
const authenticationRoutes = require('./routes/authentication');

// Use for JSON and URL Parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Set CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//Routes
app.use('/blog', blogRoutes);
app.get('/', (req, res, next) => res.status(200).sendFile(index));
app.get('/index.html', (req, res, next) => res.status(200).sendFile(index));

//404 - Page Not Found
app.use((req, res, next) => res.status(404).sendFile(notFound));

//Error Handler
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}`))