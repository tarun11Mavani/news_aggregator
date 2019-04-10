// Import Dependencies
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
var bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const posts = require('./server/routes/post.js');

// Connect to database
var { mongoose } = require('./server/db/mongoose.js');

const app = express();

app.use(helmet()); // Sanitization of incoming requests
app.use(morgan('dev')); // Logging of incoming requests
app.use(express.json()); // Parse JSON encoded payloads in request
app.use(express.urlencoded({ extended: false })); // Parse URL encoded payload in requests

// Set custom HTTP response headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token',
  );
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.use(bodyParser.json());

app.use('/posts', posts);

// Error handling
app.use((err, req, res, next) => {
  if (res.headersSent) next(err);
  console.log(err);
  res.send('Server Error. Something Broke!');
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server running on port', port, '...'));
